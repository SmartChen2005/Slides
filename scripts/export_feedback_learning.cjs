/* Export the reviewed web deck; public assets stay beside the presentation. */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
(async () => {
  const root = path.resolve('feedback-learning');
  const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.join(root,'index.html')).href);
    await page.emulateMedia({reducedMotion:'reduce'});
    fs.mkdirSync(path.join(root,'thumbnails'),{recursive:true});
    for (const [i,slide] of [0,3,8].entries()) {
      await page.evaluate(index=>deckAPI.showSlide(index),slide);
      await page.locator('.stage').screenshot({path:path.join(root,'thumbnails',`0${i+1}.webp`),type:'webp',quality:88});
    }
    await page.emulateMedia({media:'print'});
    await page.pdf({path:path.join(root,'feedback-learning.pdf'),printBackground:true,preferCSSPageSize:true,tagged:true,displayHeaderFooter:false});
    console.log('Exported 16-page PDF and three slide thumbnails.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
