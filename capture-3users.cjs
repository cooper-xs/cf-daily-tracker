const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2500 });
  
  // 访问应用
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await sleep(3000);
  
  // 点击"最近30天"按钮
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text?.includes('最近30天') || text?.includes('Last 30 Days')) {
      await btn.click();
      console.log('Clicked 最近30天');
      break;
    }
  }
  await sleep(1000);
  
  // 输入三个用户
  const input = await page.$('input');
  if (input) {
    await input.click();
    await input.type('yume7,jiangly,tourist');
    await sleep(1000);
    
    // 点击查询按钮
    const searchButtons = await page.$$('button');
    for (const btn of searchButtons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('查询') || text?.includes('Search')) {
        await btn.click();
        console.log('Clicked search');
        break;
      }
    }
    
    // 等待加载完成
    await sleep(12000);
    
    // 截图 - 中文 PC 完整页面
    await page.screenshot({ path: 'final-zh-3users.png', fullPage: true });
    console.log('3 users screenshot saved');
    
    // 滚动到 PK 区域
    await page.evaluate(() => {
      const pkTitle = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('PK') || el.textContent.includes('对比'));
      if (pkTitle) pkTitle.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    
    // 确保 PK 区域是 yume7 vs jiangly（可能需要选择）
    // 先截图当前状态
    await page.screenshot({ path: 'final-pk-yume7-jiangly.png', fullPage: false });
    console.log('PK screenshot saved');
    
    // 尝试设置挑战者为 yume7，对手为 jiangly
    const selects = await page.$$('select');
    if (selects.length >= 2) {
      // 第一个 select 是挑战者
      await selects[0].select('yume7');
      await sleep(500);
      // 第二个 select 是对手
      await selects[1].select('jiangly');
      await sleep(1000);
      
      await page.screenshot({ path: 'final-pk-result.png', fullPage: false });
      console.log('PK result screenshot saved');
    }
  }

  await browser.close();
  console.log('All done');
}

capture().catch(console.error);
