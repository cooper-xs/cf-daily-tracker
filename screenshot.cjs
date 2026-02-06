const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 2000 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:8080/ranking-preview.html', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'ranking-preview.png', fullPage: true });
  console.log('Screenshot saved to ranking-preview.png');
  
  await browser.close();
})();
