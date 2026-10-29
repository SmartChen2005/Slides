/* Run with the bundled Playwright package on NODE_PATH. No package install. */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const out = path.resolve("artifacts/vr-graffiti/qa");
fs.mkdirSync(out, { recursive: true });

(async () => {
  const executablePath = process.env.BROWSER_EXECUTABLE || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve("vr-graffiti/index.html")).href, { waitUntil: "networkidle" });
  const state = await page.evaluate(() => window.deckAPI.getState());
  assert.equal(state.totalTime, 370);
  assert.equal(state.mainCount, 11);
  assert.equal(state.totalCount, 11);
  const helperBounds = await page.locator('body > svg[aria-hidden="true"]').evaluate(node => { const r = node.getBoundingClientRect(); return [r.width, r.height, getComputedStyle(node).overflow]; });
  assert.deepEqual(helperBounds, [0, 0, 'hidden']);
  const layout = [];
  for (let i = 0; i < 11; i++) {
    await page.evaluate(index => { deckAPI.showSlide(index); deckAPI.seek(GraffitiMotion.staticTimes[index]); deckAPI.settleTransitions(); }, i);
    await page.waitForTimeout(70);
    const details = await page.evaluate(() => {
      const slide = document.querySelector(".slide.active");
      const bounds = slide.getBoundingClientRect();
      const bleed = [...slide.querySelectorAll("h1,h2,h3,p,td,th,figcaption")].filter(node => {
        const r = node.getBoundingClientRect();
        return r.right > bounds.right + 1 || r.bottom > bounds.bottom + 1 || r.left < bounds.left - 1 || r.top < bounds.top - 1;
      }).map(node => node.textContent.slice(0, 80));
      const citation = slide.querySelector(".cite");
      const collisions = citation ? [...slide.querySelectorAll("h1,h2,h3,p,figcaption")].filter(node => !node.matches(".cite") && node.getBoundingClientRect().bottom > citation.getBoundingClientRect().top - 8).map(node => node.textContent.slice(0, 80)) : [];
      return { title: slide.getAttribute("aria-label"), bleed, collisions, scroll: [slide.scrollWidth, slide.scrollHeight], notesWords: GRAFFITI_DECK[deckAPI.getState().currentSlide].notes.join(" ").split(/\s+/).length };
    });
    layout.push(details);
    assert.equal(details.bleed.length, 0, `Slide ${i + 1} overflow: ${details.bleed}`);
    assert.equal(details.collisions.length, 0, `Slide ${i + 1} citation collision: ${details.collisions}`);
    await page.screenshot({ path: path.join(out, `slide-${String(i + 1).padStart(2, "0")}.png`), animations: "disabled" });
  }
  assert.deepEqual(await page.locator(".solution-image").evaluateAll(nodes => nodes.map(node => node.complete && node.naturalWidth > 0)), [true, true]);
  const progressPositions = [];
  for (const index of [6,7,8,9]) {
    await page.evaluate(i => { deckAPI.showSlide(i); deckAPI.seek(GraffitiMotion.staticTimes[i]); deckAPI.settleTransitions(); }, index);
    const bar = page.locator('.slide.active .learning-progress');
    assert.equal(await bar.locator('[aria-current="step"]').count(), 1);
    progressPositions.push(await bar.evaluate(node => node.offsetTop));
  }
  assert.equal(new Set(progressPositions).size, 1);
  await page.evaluate(() => { deckAPI.showSlide(6); deckAPI.settleTransitions(); });
  const toolFrames = [];
  for (const time of [.8,2.7,5.5]) {
    await page.evaluate(t => deckAPI.seek(t), time);
    toolFrames.push(await page.locator('#learn-spray,#learn-marker,#learn-roller').evaluateAll(nodes => nodes.map(node => node.toDataURL())));
    await page.screenshot({path:path.join(out,`learning-tools-${time}.png`)});
  }
  for (let tool=0;tool<3;tool++) assert.equal(new Set(toolFrames.map(frame=>frame[tool])).size,3);
  await page.evaluate(() => deckAPI.seek(7.97));
  await page.locator('#pause').click();
  await page.waitForTimeout(220);
  assert.equal(await page.evaluate(() => deckAPI.getState().paused),false);
  assert.ok(await page.evaluate(() => deckAPI.getState().elapsed)<1);
  await page.locator('#pause').click();
  const guidanceFrames=[];
  await page.evaluate(() => { deckAPI.showSlide(7); deckAPI.settleTransitions(); });
  for (const time of [3.5,9.5,17]) {
    await page.evaluate(t => deckAPI.seek(t),time);
    guidanceFrames.push(await page.locator('#learn-guidance').evaluate(node=>node.toDataURL()));
    await page.screenshot({path:path.join(out,`learning-guidance-${time}.png`)});
  }
  assert.equal(new Set(guidanceFrames).size,3);
  assert.equal(await page.locator('#slide-8>.lead').textContent(),'Consistent lines require precise control of distance, speed, and angle.');
  await page.evaluate(()=>deckAPI.seek(18));
  const sprayContrast=await page.locator('#learn-guidance').evaluate(node=>{
    const ctx=node.getContext('2d');const light=(x,y)=>{const p=ctx.getImageData(x*2,y*2,1,1).data;return (p[0]+p[1]+p[2])/3;};
    return {ideal:light(382,38),close:light(382,100),far:light(382,162),slow:light(382,224),angleTop:light(382,269),angleBottom:light(382,297)};
  });
  assert.ok(sprayContrast.close<sprayContrast.ideal-20,'Close spray should be visibly darker');
  assert.ok(sprayContrast.far>sprayContrast.ideal+40,'Distant spray should be visibly faint');
  assert.ok(sprayContrast.slow<sprayContrast.ideal-15,'Slow movement should build up paint');
  assert.ok(sprayContrast.angleBottom<sprayContrast.angleTop-20,'Oblique spray should have uneven coverage');
  await page.evaluate(() => { deckAPI.showSlide(8); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('.alphabet-reference>img').evaluate(node=>node.complete&&node.naturalWidth===540),true);
  await page.locator('[data-letter="12"]').click();
  assert.equal(await page.locator('#selected-letter').textContent(),'Letter M');
  await page.locator('[data-letter="12"]').press('ArrowRight');
  assert.equal(await page.locator('#selected-letter').textContent(),'Letter N');
  assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),8);
  await page.screenshot({path:path.join(out,'learning-letter-selected.png')});
  await page.evaluate(()=>{deckAPI.showSlide(9);deckAPI.settleTransitions();});
  assert.equal(await page.locator('#slide-10>.lead').textContent(),'A space for experimentation and personal style.');
  assert.equal(await page.locator('.creation-note').textContent(),'Customize the wall. Experiment with materials. Create your own style.');
  assert.deepEqual(await page.locator('.wall-materials img').evaluateAll(nodes=>nodes.map(node=>node.complete&&node.naturalWidth>0)),[true,true,true]);
  assert.equal(await page.locator('.wall-tag image').count(),3);
  assert.equal(await page.locator('#slide-10 button,#slide-10 canvas,#slide-10 input').count(),0);
  assert.equal(await page.locator('#pause').isDisabled(),true);
  // Keyboard, history and control behavior are verified in the rendered deck.
  await page.keyboard.press("Home");
  assert.equal(await page.locator("#previous").isDisabled(), true);
  await page.locator("#next").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 1);
  await page.locator("#previous").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 0);
  await page.locator("#next").click();
  await page.goBack();
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 0);
  await page.keyboard.press("End");
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 10);
  assert.equal(await page.locator('.slide.active h2').textContent(),'Technical Implementation Plan');
  assert.equal(await page.locator('#slide-counter').textContent(),'11 / 11');
  assert.equal(await page.locator('.tool-gallery').count(),0);
  assert.equal(await page.locator("#next").isDisabled(), true);
  await page.keyboard.press("n");
  assert.equal(await page.locator("#notes,#notes-toggle").count(), 0);
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 10);
  await page.locator("#fullscreen").click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
  await page.locator("#fullscreen").click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
  await page.evaluate(() => deckAPI.showSlide(0));
  await page.locator("#replay").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), false);
  await page.locator("#pause").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  assert.equal(await page.locator('#slide-1').innerText(), 'VR Graffiti');
  assert.equal(await page.locator('#hero-motion').count(), 1);
  assert.equal(await page.locator('#slide-2 h2').textContent(), 'Why Learn Graffiti in VR?');
  assert.deepEqual(await page.locator('.why-skills h3').allTextContents(), ['Movement', 'Distance & Speed', 'Lettering']);
  assert.deepEqual(await page.locator('.barriers-gallery img').evaluateAll(nodes => nodes.map(node => node.complete && node.naturalWidth > 0)), [true, true, true]);
  await page.evaluate(() => { deckAPI.showSlide(3); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('#slide-4').innerText(), 'Graffiti combines artistic expression with embodied motor skills, but beginners rarely have access to structured, repeatable practice with feedback.');
  assert.equal(await page.locator('#pause').isDisabled(), true);
  assert.equal(await page.locator('#replay').isDisabled(), true);
  await page.evaluate(() => { deckAPI.showSlide(0); deckAPI.seek(7); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('#slide-6 h2').textContent(), 'From Simulation to Skill Learning');
  assert.deepEqual(await page.locator('.theory-grid h3').allTextContents(), ['Observational Learning', 'Scaffolding', 'Constructionism']);
  assert.deepEqual(await page.locator('.barriers-gallery img').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).filter)), ['grayscale(1)', 'grayscale(1)', 'grayscale(1)']);
  await page.locator("#animation-time").fill("2.5");
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), 2.5);
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  await page.locator("#animation-time").press("ArrowRight");
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 0);
  await page.evaluate(() => deckAPI.seek(6.95));
  await page.locator("#pause").click();
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), 7);
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  // Interrupted slide transitions keep the presentation value and never lock input.
  await page.evaluate(() => { deckAPI.showSlide(0); deckAPI.settleTransitions(); deckAPI.showSlide(1); });
  await page.waitForTimeout(60);
  const beforeReverse = await page.locator("#slide-1").evaluate(node => Number(node.style.opacity));
  await page.evaluate(() => deckAPI.showSlide(0));
  const afterReverse = await page.locator("#slide-1").evaluate(node => Number(node.style.opacity));
  assert.ok(Math.abs(afterReverse - beforeReverse) < .3);
  await page.evaluate(() => { deckAPI.showSlide(9); deckAPI.seek(12); deckAPI.settleTransitions(); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(out, "mobile.png") });
  assert.equal(await page.locator("#next").isVisible(), true);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    await page.evaluate(i => { deckAPI.showSlide(i); deckAPI.seek(GraffitiMotion.staticTimes[i]); deckAPI.settleTransitions(); }, index);
    await page.screenshot({ path: path.join(out, `mobile-slide-${index + 1}.png`) });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  const stopped = await page.evaluate(() => deckAPI.getState().elapsed);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), stopped);
  await page.evaluate(() => { deckAPI.showSlide(6); deckAPI.settleTransitions(); });
  const reducedTools = await page.evaluate(() => deckAPI.getState());
  await page.waitForTimeout(220);
  assert.equal(reducedTools.paused,true);
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed),reducedTools.elapsed);
  assert.deepEqual(errors, []);
  const report = { state, layout, errors, checked: ["11 slide layouts", "arrows and Home/End", "hash history", "notes UI and shortcut removed", "play/pause/replay", "title-only cover with S animation", "physical skill overview", "three practice barrier photos", "single-sentence learning gap", "two supplied solution images", "timeline scrubbing and keyboard input", "one-shot animation holds", "spring interruption", "390px viewport including all six opening slides", "reduced motion"] };
  fs.writeFileSync(path.join(out, "browser-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
