const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:5173/login');
    // Login
    await page.type('input[type="email"]', 'admin@rmbf.com');
    await page.type('input[type="password"]', 'admin123'); // Adjust if needed
    // Click button
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Now visit a member page, but we don't know the exact URL. 
    // We can go to /members and extract a link!
    await page.goto('http://localhost:5173/members');
    await page.waitForSelector('a[href^="/members/"]');
    const memberLink = await page.$eval('a[href^="/members/"]', a => a.href);
    console.log('Visiting member:', memberLink);
    
    await page.goto(memberLink);
    await new Promise(r => setTimeout(r, 2000));
    
  } catch(e) {
    console.log('SCRIPT_ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
