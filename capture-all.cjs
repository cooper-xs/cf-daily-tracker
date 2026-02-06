const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 设置视口尺寸
  const viewports = {
    pc: { width: 1280, height: 900 },
    mobile: { width: 375, height: 812 }
  };

  const scenarios = [
    { name: 'zh-pc', lang: 'zh-CN', viewport: viewports.pc },
    { name: 'en-pc', lang: 'en', viewport: viewports.pc },
    { name: 'zh-mobile', lang: 'zh-CN', viewport: viewports.mobile },
    { name: 'en-mobile', lang: 'en', viewport: viewports.mobile },
  ];

  for (const scenario of scenarios) {
    const page = await browser.newPage();
    await page.setViewport(scenario.viewport);
    
    // 设置语言
    await page.setExtraHTTPHeaders({
      'Accept-Language': scenario.lang
    });
    
    // 设置 localStorage 语言
    await page.evaluateOnNewDocument((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, scenario.lang);
    
    await page.goto('http://localhost:8080/ranking-preview.html', { waitUntil: 'networkidle0' });
    await sleep(1000);
    
    // 如果是英文模式，点击切换语言按钮（假设有）
    if (scenario.lang === 'en') {
      // 在预览页面，我需要模拟语言切换
      // 由于预览页面是静态HTML，我会直接截图
    }
    
    await page.screenshot({ 
      path: `screenshot-${scenario.name}.png`, 
      fullPage: true 
    });
    
    console.log(`Screenshot saved: screenshot-${scenario.name}.png`);
    await page.close();
  }

  await browser.close();
}

captureScreenshots().catch(console.error);
