const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1500 });
  
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
    
    // 等待加载完成 - 等待数据出现
    await sleep(15000);
    
    // 截图 - 折叠状态（等待排名入口出现）
    await page.screenshot({ path: 'v2-collapsed.png', fullPage: false });
    console.log('Collapsed saved');
    
    // 点击展开
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('展开') || text?.includes('竞技场')) {
        await btn.click();
        console.log('Expanded');
        break;
      }
    }
    
    await sleep(1500);
    
    // 滚动到PK区域并截图
    await page.evaluate(() => {
      const pkTitle = Array.from(document.querySelectorAll('h3')).find(el => 
        el.textContent.includes('PK') || el.textContent.includes('对比') || el.textContent.includes('全维度')
      );
      if (pkTitle) pkTitle.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(500);
    
    await page.screenshot({ path: 'v2-expanded.png', fullPage: false });
    console.log('Expanded saved');
  }

  await browser.close();
}

capture().catch(console.error);
