const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await sleep(3000);
  
  // 点击最近30天
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text?.includes('最近30天')) {
      await btn.click();
      break;
    }
  }
  await sleep(500);
  
  // 输入3个用户
  const input = await page.$('input');
  if (input) {
    await input.type('yume7,jiangly,tourist');
    await sleep(500);
    
    const searchButtons = await page.$$('button');
    for (const btn of searchButtons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('查询')) {
        await btn.click();
        break;
      }
    }
    
    await sleep(12000);
    
    // 截图 - 折叠状态
    await page.screenshot({ path: 'optimized-collapsed.png', fullPage: false });
    console.log('Collapsed screenshot saved');
    
    // 找到并点击展开按钮
    const expandButtons = await page.$$('button');
    for (const btn of expandButtons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('展开') || text?.includes('多人竞技场')) {
        await btn.click();
        console.log('Clicked expand');
        break;
      }
    }
    
    await sleep(1000);
    await page.screenshot({ path: 'optimized-expanded.png', fullPage: true });
    console.log('Expanded screenshot saved');
  }

  await browser.close();
}

capture().catch(console.error);
