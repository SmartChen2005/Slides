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
  assert.equal(state.totalTime, 605);
  assert.equal(state.mainCount, 16);
  assert.equal(state.totalCount, 19);
  const helperBounds = await page.locator('body > svg[aria-hidden="true"]').evaluate(node => { const r = node.getBoundingClientRect(); return [r.width, r.height, getComputedStyle(node).overflow]; });
  assert.deepEqual(helperBounds, [0, 0, 'hidden']);
  const layout = [];
  for (let i = 0; i < 19; i++) {
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
  await page.evaluate(() => { deckAPI.showSlide(8); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('.alphabet-reference>img').evaluate(node=>node.complete&&node.naturalWidth===540),true);
  await page.locator('[data-letter="12"]').click();
  assert.equal(await page.locator('#selected-letter').textContent(),'Letter M');
  await page.locator('[data-letter="12"]').press('ArrowRight');
  assert.equal(await page.locator('#selected-letter').textContent(),'Letter N');
  assert.equal(await page.evaluate(()=>deckAPI.getState().currentSlide),8);
  await page.screenshot({path:path.join(out,'learning-letter-selected.png')});
  await page.evaluate(() => { deckAPI.showSlide(9); deckAPI.seek(.4); deckAPI.settleTransitions(); });
  const outline=await page.locator('#learn-create').evaluate(node=>node.toDataURL());
  await page.evaluate(()=>deckAPI.seek(12));
  assert.notEqual(await page.locator('#learn-create').evaluate(node=>node.toDataURL()),outline);
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
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 15);
  await page.locator("#next").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 16);
  await page.locator("#next").click();
  await page.locator("#next").click();
  assert.equal(await page.locator("#next").isDisabled(), true);
  await page.keyboard.press("n");
  assert.equal(await page.locator("#notes").isVisible(), true);
  await page.locator("#notes-close").click();
  assert.equal(await page.locator("#notes").isVisible(), false);
  await page.locator("#notes-toggle").click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#notes").isVisible(), false);
  assert.equal(await page.locator("#notes-toggle").evaluate(node => node === document.activeElement), true);
  await page.locator("#fullscreen").click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
  await page.locator("#fullscreen").click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
  await page.evaluate(() => deckAPI.showSlide(11));
  await page.locator("#replay").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), false);
  await page.locator("#pause").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  const snapshots = [];
  for (const t of [2.5, 7.7, 13.8, 18]) {
    await page.evaluate(time => deckAPI.seek(time), t);
    snapshots.push(await page.locator("#journey-phase").textContent());
    await page.screenshot({ path: path.join(out, `journey-${t}.png`) });
  }
  assert.equal(new Set(snapshots).size, 4);
  assert.equal(await page.locator('#slide-1').innerText(), 'VR Graffiti');
  assert.equal(await page.locator('#hero-motion').count(), 1);
  assert.equal(await page.locator('#slide-2 h2').textContent(), 'Why Learn Graffiti in VR?');
  assert.deepEqual(await page.locator('.why-skills h3').allTextContents(), ['Movement', 'Distance & Speed', 'Lettering']);
  assert.deepEqual(await page.locator('.barriers-gallery img').evaluateAll(nodes => nodes.map(node => node.complete && node.naturalWidth > 0)), [true, true, true]);
  await page.evaluate(() => { deckAPI.showSlide(3); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('#slide-4').innerText(), 'Graffiti combines artistic expression with embodied motor skills, but beginners rarely have access to structured, repeatable practice with feedback.');
  assert.equal(await page.locator('#pause').isDisabled(), true);
  assert.equal(await page.locator('#replay').isDisabled(), true);
  await page.evaluate(() => { deckAPI.showSlide(13); deckAPI.seek(0); deckAPI.settleTransitions(); });
  const playgroundFrames = [];
  const playgroundPhases = [];
  for (const time of [.9, 2.9, 5.4, 7, 10.6, 16]) {
    await page.evaluate(t => deckAPI.seek(t), time);
    playgroundFrames.push(await page.locator('#playground-motion').evaluate(node => node.toDataURL()));
    playgroundPhases.push(await page.locator('#playground-phase').textContent());
    await page.screenshot({path:path.join(out,`playground-${time}.png`)});
  }
  assert.equal(new Set(playgroundFrames).size, 6);
  assert.equal(new Set(playgroundPhases).size, 3);
  assert.equal(await page.locator('#slide-14 h2').textContent(), 'Free Space to Practice');
  assert.equal(await page.locator('#slide-15 h2').textContent(), 'Beyond Traditional 3D Art');
  await page.evaluate(() => deckAPI.showSlide(14));
  await page.evaluate(() => deckAPI.seek(.8));
  const flat = await page.locator("#depth-motion").evaluate(node => node.toDataURL());
  await page.screenshot({ path: path.join(out, "depth-flat.png") });
  await page.evaluate(() => deckAPI.seek(12));
  assert.notEqual(await page.locator("#depth-motion").evaluate(node => node.toDataURL()), flat);
  await page.screenshot({ path: path.join(out, "depth-spatial.png") });
  await page.evaluate(() => { deckAPI.showSlide(11); deckAPI.seek(18.5); deckAPI.settleTransitions(); });
  assert.equal(await page.locator('#slide-6 h2').textContent(), 'From Simulation to Skill Learning');
  assert.deepEqual(await page.locator('.theory-grid h3').allTextContents(), ['Observational Learning', 'Scaffolding', 'Constructionism']);
  assert.deepEqual(await page.locator('.barriers-gallery img').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).filter)), ['grayscale(1)', 'grayscale(1)', 'grayscale(1)']);
  await page.locator("#animation-time").fill("2.5");
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), 2.5);
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  await page.locator("#animation-time").press("ArrowRight");
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 11);
  await page.evaluate(() => deckAPI.seek(18.45));
  await page.locator("#pause").click();
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), 18.5);
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  // Interrupted slide transitions keep the presentation value and never lock input.
  await page.evaluate(() => { deckAPI.showSlide(0); deckAPI.settleTransitions(); deckAPI.showSlide(1); });
  await page.waitForTimeout(60);
  const beforeReverse = await page.locator("#slide-1").evaluate(node => Number(node.style.opacity));
  await page.evaluate(() => deckAPI.showSlide(0));
  const afterReverse = await page.locator("#slide-1").evaluate(node => Number(node.style.opacity));
  assert.ok(Math.abs(afterReverse - beforeReverse) < .3);
  await page.evaluate(() => { deckAPI.showSlide(14); deckAPI.seek(12); deckAPI.settleTransitions(); });
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
  const report = { state, layout, errors, checked: ["19 slide layouts", "arrows and Home/End", "hash history", "notes focus and Escape", "play/pause/replay", "four learning phases", "title-only cover with S animation", "physical skill overview", "three practice barrier photos", "single-sentence learning gap", "surface creation, placement and spatial painting animation", "time-to-depth geometry", "two supplied solution images", "timeline scrubbing and keyboard input", "one-shot animation holds", "spring interruption", "390px viewport including all six opening slides", "reduced motion"] };
  fs.writeFileSync(path.join(out, "browser-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
