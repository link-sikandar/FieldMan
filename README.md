# FieldMan — Static Website

A complete, responsive, static marketing website for **FieldMan**, a multidiscipline
engineering and construction contractor (civil, solar, electrical, mechanical, piping).

No build step, no framework, no dependencies. Plain HTML, CSS and JavaScript — open it,
edit it, upload it.

---

## 1. Viewing the site

**Quickest:** double-click `index.html`.

**Recommended** (so the map embed and fonts behave exactly as they will in production),
serve it over HTTP from this folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## 2. Folder structure

```
FieldMan/
├── index.html          Home
├── about.html          Company overview, mission/vision, leadership, clients
├── services.html       All six services + detail sections + FAQ
├── projects.html       Filterable portfolio (28 photos) with lightbox
├── hse.html            Health, Safety & Environment + QA/QC
├── careers.html        Why work here, vacancies, how to apply
├── contact.html        Contact cards, quote form, map, FAQ
├── README.md           This file
└── assets/
    ├── css/style.css   All styling (one file, sectioned and commented)
    ├── js/main.js      Nav, filters, lightbox, counters, form (one file)
    └── img/
        ├── logo-mark.svg, favicon.svg
        ├── hero/       3 large header images
        ├── projects/   28 full-size project photos (max 1600px)
        │   └── thumbs/ 28 grid thumbnails (max 760px)
        └── team/       4 leadership portraits  ← PLACEHOLDERS, see §3
```

---

## 3. ⚠️ Placeholders you must replace before going live

Everything below is stand-in content used so the layout could be designed and tested.
**None of it is real.** Replace it all before the site is published.

### 3.1 Contact details

These exact strings appear across all seven pages. Use find-and-replace across the folder:

| Find | Where it appears | Replace with |
|---|---|---|
| `+92 21 3456 7890` | top bar, footer, contact page | your landline |
| `+922134567890` | `tel:` links (no spaces) | your landline, digits only |
| `+92 300 1234567` | footer, contact page | your mobile |
| `+923001234567` | `tel:` links | your mobile, digits only |
| `923001234567` | WhatsApp button `wa.me/…` | your WhatsApp number, digits only, country code, no `+` |
| `info@fieldman.com.pk` | everywhere | your email |
| `careers@fieldman.com.pk` | careers page | your HR email |
| `Plot 27-C, Sector 15, Korangi Industrial Area` | footer, contact, mobile menu | your street address |
| `Karachi 74900, Pakistan` | footer, contact page | your city / postcode |
| `Mon – Sat, 8:00 AM – 6:00 PM` | top bar, footer, contact page | your hours |

### 3.2 Leadership team — names, bios and photographs

`about.html`, inside the block marked `<!-- PLACEHOLDER CONTENT … -->`.

The four names (**Ahmed Raza Khan**, **Bilal Ahmed Siddiqui**, **Usman Tariq**,
**Sana Iqbal**), their job titles, quotes and biographies are **invented for layout
purposes**. Replace all of them with your real people.

The four photographs in `assets/img/team/` are free-licence stock portraits
(Unsplash / Pexels) of people who have **no connection to FieldMan**. Publishing them
next to a name and job title would misrepresent those individuals. **Swap in real
photographs of your team before the site goes public.**

Replace the files, keeping the same names and a square (1:1) crop — 560×560 px works well:

```
assets/img/team/leader-ceo.jpg        → your CEO / founder
assets/img/team/leader-director.jpg   → your co-founder / director
assets/img/team/leader-gm.jpg         → your GM, Projects
assets/img/team/leader-hse.jpg        → your HSE / quality lead
```

### 3.3 Testimonials

`index.html`, marked with `<!-- PLACEHOLDER CONTENT … -->`. The three quotes are
written examples, not real client feedback. Replace them with genuine, approved
testimonials — or delete the whole `<section>` if you do not have any yet.

### 3.4 Client list

`about.html`, section `id="clients"`. Currently generic sector labels
("Textile & Apparel Group", etc.) rather than invented company names. Replace with
your real clients **once you have their permission to be named**, or leave the
sector labels, which are safe to publish as-is.

### 3.5 Careers vacancies

`careers.html` — six example job listings. Replace with your real openings, or delete
the section.

### 3.6 Social media links

Every social icon currently points at `href="#"`. Search for `aria-label="FieldMan on`
and add your real URLs (top bar and footer on all seven pages).

### 3.7 Map

`contact.html` uses a Google Maps embed pointing at Korangi Industrial Area, Karachi.
To change it: open Google Maps → find your location → **Share → Embed a map** → copy
the `src` from the generated `<iframe>` and paste it over the existing one.

### 3.8 Statistics

The numbers on the home page (12+ years, 250+ projects, 38+ MW, 600 staff, 1.5M safe
man-hours, 98% on-time, 92% repeat clients) are plausible placeholders. Update them to
your real figures — search for `data-count=` and edit the value; the text beside it is
in the next line.

---

## 4. Project photographs

The 28 photographs in `assets/img/projects/` are **your own site photos**, taken from
the WhatsApp folder you supplied. They were rotated (EXIF-corrected), resized and
compressed for web use — originals untouched. Roughly 3.2 MB of source photos became
optimised full-size and thumbnail pairs.

They are grouped into five filter categories: Solar (6), Civil (3), Structural Steel (8),
Mechanical & Piping (7), Electrical (4).

### Adding or removing a project

Each card in `projects.html` is one `<button class="project-card">` block:

```html
<button class="project-card reveal" type="button" data-cat="solar"
        data-full="assets/img/projects/YOUR-FILE.jpg"
        data-title="Project Title" data-sub="One-line description"
        aria-label="View larger image: Project Title">
  <img src="assets/img/projects/thumbs/YOUR-FILE.jpg" alt="Project Title — description" loading="lazy" decoding="async">
  ...
</button>
```

- `data-cat` must be one of: `solar`, `civil`, `structural`, `mechanical`, `electrical`
  (these match the filter buttons above the grid).
- Put the large image in `projects/` and a smaller copy in `projects/thumbs/`.
- Copy an existing block and edit it — the filter and lightbox pick it up automatically.

Captions were written from what is visible in each photo. Correct any that describe the
work inaccurately — you know what each job actually was.

---

## 5. The contact form

Out of the box the form **validates in the browser, then opens the visitor's email
client** with the enquiry pre-filled. That works with no server at all, but it depends on
the visitor having email set up.

To receive submissions properly, sign up for a form service (Formspree, FormSubmit,
Getform, Web3Forms — all have free tiers), then add one attribute in `contact.html`:

```html
<form class="contact-form" data-validate
      data-endpoint="https://formspree.io/f/YOUR_FORM_ID"
      data-mailto="info@fieldman.com.pk" novalidate>
```

With `data-endpoint` present, the form POSTs the fields as JSON and shows a success
message in place of opening the mail client. `data-mailto` stays as the fallback shown
if the request fails.

---

## 6. Changing the look

### Colours

All colours are CSS variables at the top of `assets/css/style.css`:

```css
:root {
  --navy-900: #061626;   /* darkest — top bar, footer */
  --navy-800: #0a2134;   /* dark sections, buttons */
  --steel-500: #2c5f8e;  /* links, icons */
  --amber-500: #f5a524;  /* primary accent — buttons, highlights */
  --ink: #0e1b2a;        /* headings */
  --body: #4d5f72;       /* body text */
  --surface: #f4f7fa;    /* alternating section background */
}
```

Change `--amber-500` and the whole site re-accents in one edit.

### Fonts

**Sora** for headings, **Inter** for body, both loaded from Google Fonts in each page's
`<head>`. To change them, swap the `<link>` in all seven files and update `--font-head`
and `--font-body` in the CSS. System fonts are already set as fallbacks, so the site
still looks correct if Google Fonts is blocked or unavailable offline.

### Logo

`assets/img/logo-mark.svg` is the badge; the "FieldMan" wordmark next to it is HTML text
(`.brand-name`), so it always renders crisply. If you have a proper logo file, replace
the SVG and optionally delete the `<span class="brand-text">…</span>` block.

---

## 7. What is built in

- Sticky header with dropdown menu; slide-in mobile drawer with expandable submenu
- Hero with overlapping statistics card and animated counters
- Six service cards plus detailed alternating sections
- Filterable 28-image portfolio with a keyboard-accessible lightbox
  (arrow keys navigate, `Esc` closes)
- Scroll-reveal animations, with a `<noscript>` fallback so content is never hidden
- Accordion FAQs on the services and contact pages
- Contact form with inline validation
- Floating WhatsApp button and back-to-top button
- Responsive from 360 px upwards; print stylesheet included
- Accessibility: skip link, ARIA states, visible focus rings, one `<h1>` per page,
  alt text on every image, and full `prefers-reduced-motion` support

### Verified

Checked in a headless Chromium across all seven pages: **0 console errors, 0 failed
requests, 0 broken internal links, no horizontal overflow at 1440 px, 390 px or 360 px**,
and every interactive component (mobile nav, submenu, filters, lightbox, accordion,
counters, form validation) confirmed working.

---

## 8. Publishing

It is a plain static site — upload the whole `FieldMan` folder to any host:

- **Shared hosting / cPanel:** upload the contents into `public_html`.
- **Netlify / Vercel / Cloudflare Pages:** drag the folder onto the dashboard. No build
  command, no output directory.
- **GitHub Pages:** push the folder and enable Pages on the branch.

Before publishing, work through §3 — especially the **team photographs and
testimonials**, which should not go live as they are.
