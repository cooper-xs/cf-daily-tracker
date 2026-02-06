const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureRanking() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  
  // 访问应用
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(2000);
  
  // 查找输入框并输入用户
  const input = await page.$('input');
  if (input) {
    await input.type('yume7,jiangly,tourist');
    await sleep(500);
    
    // 点击查询按钮或按回车
    const searchBtn = await page.$('button[type="submit"]');
    if (searchBtn) {
      await searchBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }
    
    // 等待加载完成
    await sleep(5000);
    
    // 截图
    await page.screenshot({ path: 'app-zh-ranking.png', fullPage: true });
    console.log('Chinese PC ranking screenshot saved');
    
    // 切换到英文
    // 找到语言切换按钮（通常是第二个按钮）
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('中') || text?.includes('En')) {
        await btn.click();
        await sleep(1000);
        break;
      }
    }
    
    await sleep(2000);
    await page.screenshot({ path: 'app-en-ranking.png', fullPage: true });
    console.log('English PC ranking screenshot saved');
  }

  // 移动端截图
  await page.setViewport({ width: 375, height: 2000 });
  await sleep(1000);
  await page.screenshot({ path: 'app-en-mobile.png', fullPage: true });
  console.log('English mobile screenshot saved');
  
  // 切回中文并截图移动端
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text?.includes('中') || text?.includes('En')) {
      await btn.click();
      await sleep(1000);
      break;
    }
  }
  
  await sleep(2000);
  await page.screenshot({ path: 'app-zh-mobile.png', fullPage: true });
  console.log('Chinese mobile screenshot saved');

  await browser.close();
}

captureRanking().catch(console.error);
