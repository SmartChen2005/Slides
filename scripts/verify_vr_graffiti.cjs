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
  assert.equal(state.totalTime, 450);
  assert.equal(state.mainCount, 11);
  assert.equal(state.totalCount, 13);
  const layout = [];
  for (let i = 0; i < 13; i++) {
    await page.evaluate(index => { deckAPI.showSlide(index); deckAPI.seek(index === 5 ? 3.1 : 6); }, i);
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
  await page.locator("#next").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().currentSlide), 11);
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
  await page.evaluate(() => deckAPI.showSlide(5));
  await page.locator("#replay").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), false);
  await page.locator("#pause").click();
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  const snapshots = [];
  for (const t of [.9, 2.8, 5.6, 7]) {
    await page.evaluate(time => deckAPI.seek(time), t);
    snapshots.push(await page.locator("#journey-phase").textContent());
    await page.screenshot({ path: path.join(out, `journey-${t}.png`) });
  }
  assert.equal(new Set(snapshots).size, 4);
  await page.evaluate(() => deckAPI.showSlide(8));
  await page.evaluate(() => deckAPI.seek(.8));
  const flat = await page.locator(".depth-ribbon").innerHTML();
  await page.screenshot({ path: path.join(out, "depth-flat.png") });
  await page.evaluate(() => deckAPI.seek(6));
  assert.notEqual(await page.locator(".depth-ribbon").innerHTML(), flat);
  await page.screenshot({ path: path.join(out, "depth-spatial.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(out, "mobile.png") });
  assert.equal(await page.locator("#next").isVisible(), true);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => deckAPI.getState().paused), true);
  const stopped = await page.evaluate(() => deckAPI.getState().elapsed);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => deckAPI.getState().elapsed), stopped);
  assert.deepEqual(errors, []);
  const report = { state, layout, errors, checked: ["13 slide layouts", "arrows and Home/End", "hash history", "notes focus and Escape", "play/pause/replay", "four learning phases", "time-to-depth geometry", "390px viewport", "reduced motion"] };
  fs.writeFileSync(path.join(out, "browser-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
