const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureRanking() {
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
  
  // 查找输入框并输入用户
  const input = await page.$('input');
  if (input) {
    await input.type('yume7,jiangly');
    await sleep(1000);
    
    // 查找并点击查询按钮
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text?.includes('查询') || text?.includes('Search')) {
        await btn.click();
        console.log('Clicked search button');
        break;
      }
    }
    
    // 等待加载完成 - 等待更长时间让API返回数据
    console.log('Waiting for data to load...');
    await sleep(10000);
    
    // 截图中文PC
    await page.screenshot({ path: 'ranking-zh-pc-full.png', fullPage: true });
    console.log('Chinese PC ranking screenshot saved');
    
    // 滚动页面确保看到排名区域
    await page.evaluate(() => window.scrollTo(0, 600));
    await sleep(1000);
    await page.screenshot({ path: 'ranking-zh-pc-scroll.png', fullPage: false });
    console.log('Chinese PC scrolled screenshot saved');
  }

  await browser.close();
  console.log('All screenshots done');
}

captureRanking().catch(err => {
  console.error(err);
  process.exit(1);
});
