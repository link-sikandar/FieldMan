const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const htmlPath = 'file:///' + path.resolve(__dirname, 'source.html').replace(/\\/g, '/');

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500); // let web fonts settle

  const outPath = 'D:/FieldMan/FieldMan-Company-Profile-2026.pdf';
  await page.pdf({
    path: outPath,
    width: '15in',
    height: '8.4375in',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  console.log('errors:', errors);
  console.log('PDF written to', outPath);
  await browser.close();
})();
