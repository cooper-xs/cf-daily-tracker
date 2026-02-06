const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 1500 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:8080/ranking-preview.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  
  // Click dark mode button
  await page.click('button');
  await new Promise(r => setTimeout(r, 500));
  
  await page.screenshot({ path: 'ranking-preview-dark.png', fullPage: false });
  console.log('Dark mode screenshot saved');
  
  await browser.close();
})();
