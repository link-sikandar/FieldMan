/* ==========================================================================
   FieldMan — site scripts
   Vanilla JS, no dependencies. Every block is defensive: if the markup for a
   feature is not on the page, the block simply does nothing.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- Year */
  $$('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------- Sticky header */
  var header = $('.header');
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------------------------------------------------- Mobile nav panel */
  var burger   = $('.burger');
  var mobile   = $('.mobile-nav');
  var backdrop = $('.mobile-backdrop');
  var mClose   = $('.mobile-close');

  function setNav(open) {
    if (!burger || !mobile) return;
    burger.setAttribute('aria-expanded', String(open));
    mobile.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var firstLink = mobile.querySelector('a, button');
      if (firstLink) firstLink.focus();
    } else {
      burger.focus();
    }
  }

  if (burger) burger.addEventListener('click', function () {
    setNav(burger.getAttribute('aria-expanded') !== 'true');
  });
  if (mClose)   mClose.addEventListener('click', function () { setNav(false); });
  if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });

  $$('.mobile-list a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  /* Mobile submenu accordions */
  $$('.mobile-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.toggle('is-open', !open);
    });
  });

  /* ------------------------------------------------- Reveal on scroll */
  var revealEls = $$('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-visible'); }, delay);
          obs.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { revealIO.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* -------------------------------------------------- Animated counters */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCounter = function (el) {
      var target   = parseFloat(el.getAttribute('data-count')) || 0;
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var duration = 1500;
      var start    = null;

      var tick = function (ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      var countIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countIO.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ------------------------------------------------------ Project filter */
  var filterBtns = $$('.filter-btn');
  var projectCards = $$('.project-card');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        projectCards.forEach(function (card) {
          var show = want === 'all' || card.getAttribute('data-cat') === want;
          card.classList.toggle('is-hidden', !show);
        });
        var empty = $('[data-empty-state]');
        if (empty) {
          var visible = projectCards.filter(function (c) { return !c.classList.contains('is-hidden'); });
          empty.hidden = visible.length > 0;
        }
      });
    });
  }

  /* ------------------------------------------------------------ Lightbox */
  var lightbox = $('.lightbox');
  if (lightbox && projectCards.length) {
    var lbImg   = $('.lightbox-figure img', lightbox);
    var lbTitle = $('[data-lb-title]', lightbox);
    var lbSub   = $('[data-lb-sub]', lightbox);
    var lastFocused = null;
    var current = 0;

    var visibleCards = function () {
      return projectCards.filter(function (c) { return !c.classList.contains('is-hidden'); });
    };

    var show = function (index) {
      var list = visibleCards();
      if (!list.length) return;
      current = (index + list.length) % list.length;
      var card = list[current];
      var full = card.getAttribute('data-full');
      var img  = card.querySelector('img');
      if (lbImg) {
        lbImg.src = full || (img ? img.src : '');
        lbImg.alt = img ? img.alt : '';
      }
      if (lbTitle) lbTitle.textContent = card.getAttribute('data-title') || '';
      if (lbSub)   lbSub.textContent   = card.getAttribute('data-sub') || '';
    };

    var open = function (card) {
      lastFocused = document.activeElement;
      var list = visibleCards();
      show(list.indexOf(card));
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
      var closeBtn = $('.lb-close', lightbox);
      if (closeBtn) closeBtn.focus();
    };

    var close = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      if (lastFocused) lastFocused.focus();
    };

    projectCards.forEach(function (card) {
      card.addEventListener('click', function () { open(card); });
    });

    var prevBtn = $('.lb-prev', lightbox);
    var nextBtn = $('.lb-next', lightbox);
    var closeBt = $('.lb-close', lightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
    if (closeBt) closeBt.addEventListener('click', close);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* Close mobile nav on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') setNav(false);
  });

  /* ----------------------------------------------------------- Accordion */
  $$('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open  = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var group = btn.closest('.accordion');

      if (group) {
        $$('.acc-btn', group).forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) p.classList.remove('is-open');
        });
      }
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.classList.toggle('is-open', !open);
    });
  });

  /* ------------------------------------------------ Leader bio see more */
  $$('.leader-more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var bio = document.getElementById(btn.getAttribute('aria-controls'));
      var label = btn.querySelector('.leader-more-label');
      btn.setAttribute('aria-expanded', String(!open));
      if (bio) bio.classList.toggle('is-expanded', !open);
      if (label) label.textContent = open ? 'See more' : 'See less';
      if (open && bio) bio.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });

  /* --------------------------------------------------------- Back to top */
  var toTop = $('.fab-top');
  if (toTop) {
    var onScrollTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 420);
    };
    onScrollTop();
    window.addEventListener('scroll', onScrollTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------- Form handling
     By default the form opens the visitor's mail client with the enquiry
     pre-filled, so the site works with no back end at all.
     To post to a form service instead (Formspree, FormSubmit, Getform, or
     your own script), add the endpoint to the form tag:

         <form class="contact-form" data-endpoint="https://formspree.io/f/xxxx">

     See README.md for details.
  ------------------------------------------------------------------------ */
  $$('form[data-validate]').forEach(function (form) {
    var status = $('.form-status', form);

    var showError = function (field, message) {
      field.classList.add('has-error');
      var msg = $('.field-error', field);
      if (msg && message) msg.textContent = message;
    };
    var clearError = function (field) { field.classList.remove('has-error'); };

    var validate = function () {
      var ok = true;
      $$('.field', form).forEach(function (field) {
        var control = field.querySelector('.input, .textarea, .select');
        if (!control) return;
        clearError(field);

        var value = (control.value || '').trim();
        if (control.hasAttribute('required') && !value) {
          showError(field, 'This field is required.');
          ok = false;
          return;
        }
        if (value && control.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          showError(field, 'Please enter a valid email address.');
          ok = false;
        }
        if (value && control.type === 'tel' && value.replace(/[^\d]/g, '').length < 7) {
          showError(field, 'Please enter a valid phone number.');
          ok = false;
        }
      });
      return ok;
    };

    $$('.input, .textarea, .select', form).forEach(function (control) {
      control.addEventListener('input', function () {
        var field = control.closest('.field');
        if (field && field.classList.contains('has-error')) clearError(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = $('.field.has-error .input, .field.has-error .textarea, .field.has-error .select', form);
        if (firstBad) firstBad.focus();
        return;
      }

      var data = {};
      $$('.input, .textarea, .select', form).forEach(function (c) {
        if (c.name) data[c.name] = c.value.trim();
      });

      var endpoint = form.getAttribute('data-endpoint');
      var submitBtn = form.querySelector('[type="submit"]');

      var succeed = function (message) {
        if (status) {
          status.textContent = message;
          status.classList.add('is-visible', 'is-success');
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Send Enquiry'; }
      };

      if (endpoint) {
        if (submitBtn) {
          submitBtn.dataset.label = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
        }
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          succeed('Thank you. Your enquiry has been sent — our team will respond within one working day.');
        }).catch(function () {
          if (status) {
            status.textContent = 'Sorry, the message could not be sent. Please email us directly at ' +
              (form.getAttribute('data-mailto') || 'Sales@fieldmansolution.com') + '.';
            status.classList.add('is-visible');
            status.classList.remove('is-success');
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Send Enquiry'; }
        });
      } else {
        var to = form.getAttribute('data-mailto') || 'Sales@fieldmansolution.com';
        var subject = 'Website enquiry' + (data.service ? ' — ' + data.service : '');
        var lines = Object.keys(data).map(function (k) {
          var label = k.charAt(0).toUpperCase() + k.slice(1).replace(/-/g, ' ');
          return label + ': ' + data[k];
        });
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        succeed('Your email application is opening with this enquiry ready to send. If nothing happens, email us at ' + to + '.');
      }
    });
  });
})();
