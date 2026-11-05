const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const out=path.resolve('artifacts/feedback-learning/qa');fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||(process.platform==='win32'?'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe':undefined),headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.resolve('feedback-learning/index.html')).href;
    await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.slide').count(),11);
    assert.equal(await page.locator('#previous').isDisabled(),true);
    for(let i=0;i<11;i++){
      await page.evaluate(i=>{deckAPI.showSlide(i);deckAPI.seek(1.2);deckAPI.settleTransitions();},i);
      const overflow=await page.locator(`#slide-${i+1}`).evaluate(node=>{
        const box=node.getBoundingClientRect(), walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),bad=[];
        while(walker.nextNode()){
          const text=walker.currentNode;if(!text.textContent.trim())continue;
          const range=document.createRange();range.selectNodeContents(text);
          for(const rect of range.getClientRects())if(rect.width&&rect.height&&(rect.left<box.left-1||rect.right>box.right+1||rect.top<box.top-1||rect.bottom>box.bottom+1))bad.push(text.textContent);
        }return bad;
      });
      assert.deepEqual(overflow,[],`slide ${i+1} text bounds`);
      await page.locator('.stage').screenshot({path:path.join(out,`slide-${i+1}.png`)});
    }
    assert.equal(await page.locator('#next').isDisabled(),true);
    // Exact source-chart structures, counts, labels and table rows survive the redesign.
    assert.equal(await page.locator('#slide-2 .original-icon').count(),3);
    assert.deepEqual(await page.locator('.selection-chart b').allTextContents(),['16,894','8,452','1,542','139','23']);
    assert.deepEqual(await page.locator('.stacked-bar').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label'))),['Elementary: 12; Middle: 7; High: 4','RCT: 5; Quasi: 2; Controlled: 6; Pre-post: 10','Simple: 14; Complex: 7; Both: 2']);
    assert.equal(await page.locator('.quality-dot').count(),23);assert.equal(await page.locator('.quality-dot.filled').count(),8);
    assert.equal(await page.locator('.evidence-grading tbody tr').count(),5);
    assert.deepEqual(await page.locator('.findings-table tbody tr').allTextContents(),[
      'Feedback10 (76.9%) for 13 studiesStrongIndividual feedback',
      'Visual vs verbal3 (100%) for 3 studiesLimited3D replay',
      'Expert model vs self model2 (66.7%) for 3 studiesLimitedSet experts',
      'Praise + information vs praise2 (66.7%) for 3 studiesModerateGive rewards',
      'Information vs praise or corrective4 (57.1%) for 7 studiesConflictingAdaptive feedback'
    ]);
    const images=await page.locator('.slide img').evaluateAll(nodes=>nodes.map(n=>n.complete&&n.naturalWidth>0));assert.equal(images.length,4);assert.ok(images.every(Boolean));
    // Motion is finite and replayable, and responds deterministically to seeking.
    await page.evaluate(()=>{deckAPI.showSlide(4);deckAPI.seek(0);deckAPI.settleTransitions();});
    const swimmer=page.locator('[data-motion="swim"]'),rest=await swimmer.getAttribute('style');
    await page.evaluate(()=>deckAPI.seek(1.2));assert.notEqual(await swimmer.getAttribute('style'),rest);
    await page.evaluate(()=>deckAPI.seek(2.4));
    const endMatrix=await swimmer.evaluate(n=>new DOMMatrix(getComputedStyle(n).transform).m41);assert.ok(Math.abs(endMatrix)<.01);
    await page.locator('#replay').click();await page.waitForTimeout(2700);assert.equal(await page.evaluate(()=>deckAPI.getState().paused),true);
    // Native range keys change the animation, not the slide.
    await page.locator('#animation-time').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),4);
    await page.locator('#notes').click();assert.equal(await page.locator('#notes-dialog').isVisible(),true);
    assert.match(await page.locator('#notes-body').innerText(),/游泳/);await page.keyboard.press('Escape');assert.equal(await page.locator('#notes').evaluate(n=>n===document.activeElement),true);
    await page.locator('#slide-counter').click();assert.equal(await page.locator('#contents-dialog [aria-current]').count(),1);
    await page.locator('[data-slide="9"]').click();assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),9);
    await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),8);
    await page.goBack();assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),9);
    await page.keyboard.press('End');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),10);
    await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),0);
    await page.goto(`${url}#slide-8`);assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),7);
    // Full screen rejection keeps navigation usable.
    await page.evaluate(()=>{document.documentElement.requestFullscreen=()=>Promise.reject(new Error('denied'));});await page.locator('#fullscreen').click();
    assert.match(await page.locator('#announcement').innerText(),/unavailable/);await page.locator('#next').click();
    assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),8);
    for(const width of [320,390,768,1024,1600]){
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow at ${width}`);
      const clipped=await page.locator('.site-footer').evaluate(n=>{const r=n.getBoundingClientRect();return r.bottom>innerHeight+1||r.left<0||r.right>innerWidth;});assert.equal(clipped,false,`toolbar at ${width}`);
    }
    await page.screenshot({path:path.join(out,'responsive.png')});
    const phone=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const touch=await phone.newPage();await touch.goto(url);await touch.locator('#next').tap();assert.equal(await touch.evaluate(()=>deckAPI.getState().currentSlide),1);await touch.locator('#notes').tap();await touch.locator('#notes-dialog [data-close]').tap();await touch.screenshot({path:path.join(out,'mobile.png')});await phone.close();
    await page.emulateMedia({reducedMotion:'reduce',contrast:'more'});await page.goto(`${url}#slide-5`);
    assert.equal(await page.locator('#replay').isDisabled(),true);assert.equal(await page.evaluate(()=>deckAPI.getState().paused),true);
    await page.evaluate(()=>deckAPI.seek(1.2));assert.equal(await swimmer.evaluate(n=>new DOMMatrix(getComputedStyle(n).transform).m41),0);
    assert.deepEqual(errors,[]);
    console.log('Feedback deck passed: 11 slide bounds; original icons/charts/tables; finite motion; keyboard/history/deep links; notes/contents/focus; fullscreen failure; 320–1600px; touch; reduced motion/high contrast.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
