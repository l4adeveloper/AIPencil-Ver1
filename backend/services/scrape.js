const { chromium } = require('playwright');

async function scrape(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

  const firstLink = await page.evaluate(() => {
    const a = document.querySelector('div.g a');
    return a ? a.href : null;
  });

  let text = '';
  if (firstLink) {
    await page.goto(firstLink, { waitUntil: 'domcontentloaded' });
    text = await page.evaluate(() => document.body.innerText);
  }

  await browser.close();
  return { firstLink, text: text.replace(/\s+/g, ' ').trim() };
}

module.exports = { scrape };
