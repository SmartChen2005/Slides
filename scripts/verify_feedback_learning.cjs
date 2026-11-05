/* Browser checks for content fit and real presentation interactions. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
  const out=path.resolve('artifacts/feedback-learning/qa');
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1600,height:1000}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.resolve('feedback-learning/index.html')).href;
    await page.goto(url);
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.slide').count(),16);
    assert.equal(await page.locator('#previous').isDisabled(),true);
    for(let i=0;i<16;i++){
      await page.evaluate(index=>deckAPI.showSlide(index),i);
      const issues=await page.locator('.slide.active').evaluate(slide=>{
        const r=slide.getBoundingClientRect();
        const source=slide.querySelector('.source').getBoundingClientRect();
        const issues=[];
        for(const node of slide.querySelectorAll('h1,h2,h3,p,blockquote,td,th')){
          const b=node.getBoundingClientRect();
          if(b.right>r.right+1||b.left<r.left-1||b.bottom>r.bottom+1)issues.push('outside: '+node.textContent.slice(0,65));
          if(node.closest('.slide-body')&&b.bottom>source.top-6&& !node.classList.contains('source'))issues.push('source overlap: '+node.textContent.slice(0,65));
        }
        const bottom=slide.querySelector('.bottom-line');
        if(bottom)for(const node of slide.querySelectorAll('.slide-body>div,.slide-body>table')){
          if(node.getBoundingClientRect().bottom>bottom.getBoundingClientRect().top-8)issues.push('bottom overlap: '+node.className);
        }
        return issues;
      });
      assert.deepEqual(issues,[],`slide ${i+1}`);
      await page.locator('.stage').screenshot({path:path.join(out,`${String(i+1).padStart(2,'0')}.png`)});
    }
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),1);
    await page.keyboard.press('ArrowRight');await page.goBack();assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),1);
    await page.keyboard.press('End');assert.equal(await page.locator('#next').isDisabled(),true);
    await page.locator('#outline').click();assert.equal(await page.locator('#outline-dialog').isVisible(),true);
    await page.locator('#outline-list button').nth(3).click();assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),3);
    await page.locator('#notes').click();assert.equal(await page.locator('#notes-dialog').isVisible(),true);
    assert.match(await page.locator('#notes-body').textContent(),/\u4e09\u4e2a\u7ef4\u5ea6/);
    await page.keyboard.press('Escape');assert.equal(await page.locator('#notes').evaluate(n=>n===document.activeElement),true);
    // Unsupported fullscreen should fail gracefully.
    await page.evaluate(()=>{document.documentElement.requestFullscreen=()=>Promise.reject(new Error('denied'));});
    await page.locator('#fullscreen').click();assert.match(await page.locator('#announcement').textContent(),/unavailable/);
    for(const width of [320,390,700,768,1024]){
      await page.setViewportSize({width,height:844});
      await page.waitForFunction(()=>document.querySelector(".stage").getBoundingClientRect().right<=innerWidth);
      for(let i=0;i<16;i++){
        await page.evaluate(index=>deckAPI.showSlide(index),i);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`horizontal overflow ${width}, slide ${i+1}`);
      }
    }
    await page.setViewportSize({width:390,height:844});await page.evaluate(()=>deckAPI.showSlide(3));
    await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
    await page.locator('#notes').click();assert.equal(await page.locator('#notes-dialog').isVisible(),true);await page.keyboard.press('Escape');
    await page.setViewportSize({width:1440,height:900});
    await page.goto(url+'#slide-9');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),8);
    await page.emulateMedia({contrast:'more',reducedMotion:'reduce'});
    await page.evaluate(()=>deckAPI.showSlide(4));assert.equal(await page.locator('.slide.active').evaluate(s=>s.getAnimations().length),0);
    await page.screenshot({path:path.join(out,'high-contrast.png')});
    assert.deepEqual(errors,[]);
    console.log('Feedback deck passed: 16 slide bounds, keyboard, history, deep links, contents, Chinese notes, focus restoration, fullscreen denial, 320-1600px, reduced motion, high contrast.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
