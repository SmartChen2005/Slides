/* Run with the bundled Playwright package on NODE_PATH. Tests staged Pages output. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const root = path.resolve("_site");
const out = path.resolve("artifacts/archive/qa");
fs.mkdirSync(out, { recursive: true });
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png" };
const server = http.createServer((request, response) => {
  let file = path.resolve(root, "." + decodeURIComponent(new URL(request.url, "http://localhost").pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { response.writeHead(404).end(); return; }
  response.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(response);
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined), headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => {
    // Chromium cancels cross-document snapshots when rapid Back navigation or
    // a reduced-motion preference change disables the transition opt-in.
    if (error.message === "Transition was aborted because of invalid state. ViewTransition opt-in disabled") return;
    errors.push(error.message);
  });
  try {
    await page.goto(base, { waitUntil: "networkidle" });
    assert.deepEqual(await page.locator(".sheet-heading h3").allTextContents(), ["VR Graffiti", "Ensemble Mutual"]);
    assert.deepEqual(await page.locator(".sheet-bottom time").allTextContents(), ["OCT 2026", "OCT 2026"]);
    assert.equal(await page.locator(".year-label").textContent(), "2026");
    await page.screenshot({ path: path.join(out, "desktop.png"), fullPage: true });
    // The existing hover fan and opening flight must still run.
    await page.locator(".deck").nth(1).hover();
    await page.waitForTimeout(750);
    assert.equal(await page.locator(".is-previewing .preview-sheet").count(), 3);
    assert.equal(await page.locator(".is-previewing .preview-sheet").first().evaluate(node => getComputedStyle(node).opacity), "1");
    await page.screenshot({ path: path.join(out, "preview-fan.png"), fullPage: true });
    await page.locator(".stack-link").first().click();
    await page.locator(".deck-flight").waitFor({ state: "attached" });
    assert.equal(await page.locator("body.opening").count(), 1);
    await page.waitForURL("**/vr-graffiti/");
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".deck-flight, body.opening, .stack-link[aria-busy]").count(), 0);
    assert.equal(await page.locator(".front-sheet").first().evaluate(node => getComputedStyle(node).visibility), "visible");
    // Category filtering, shareable URL state, empty-state recovery and Back.
    await page.getByRole("button", { name: "Tech", exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get("category"), "tech");
    assert.deepEqual(await page.locator(".sheet-heading h3").allTextContents(), ["Ensemble Mutual"]);
    await page.goBack();
    assert.equal(await page.locator(".deck").count(), 2);
    await page.getByRole("button", { name: "Design", exact: true }).click();
    assert.equal(await page.locator(".empty-state").isVisible(), true);
    await page.getByRole("button", { name: "View all presentations" }).click();
    assert.equal(await page.getByRole("button", { name: "All", exact: true }).evaluate(node => node === document.activeElement), true);
    // Navigate to a deck with actual keyboard input.
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    assert.equal(await page.locator(".stack-link").first().evaluate(node => node === document.activeElement && node.matches(":focus-visible")), true);
    await page.keyboard.press("Enter");
    await page.waitForURL("**/vr-graffiti/");
    await page.goBack({ waitUntil: "networkidle" });
    for (const width of [320, 390, 768, 1024, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
      // Segoe UI's ink extends beyond its tight line box. Detect a hidden third
      // line rather than mistaking normal font descent for truncated content.
      const clipped = await page.locator(".sheet-heading h3").evaluateAll(nodes => nodes.some(node => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return new Set([...range.getClientRects()].map(rect => Math.round(rect.top))).size > 2;
      }));
      assert.equal(clipped, false, `clipped title at ${width}`);
    }
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const phone = await touch.newPage();
    await phone.goto(base, { waitUntil: "networkidle" });
    await phone.waitForFunction(() => [...document.querySelectorAll(".preview-sheet")].every(node => getComputedStyle(node).opacity === "1"));
    assert.equal(await phone.locator(".preview-sheet").first().evaluate(node => getComputedStyle(node).opacity), "1");
    await phone.screenshot({ path: path.join(out, "mobile.png"), fullPage: true });
    await phone.locator(".stack-link").nth(1).tap();
    await phone.waitForURL("**/ensemble-mutual/");
    await touch.close();
    await page.emulateMedia({ reducedMotion: "reduce", contrast: "more" });
    await page.goto(base);
    await page.locator(".stack-link").first().click();
    await page.waitForURL("**/vr-graffiti/");
    assert.equal(await page.locator(".deck-flight").count(), 0);
    // Missing archive payload retains a usable recovery control.
    await page.route("**/archive-data.js", route => route.fulfill({ contentType: "text/javascript", body: "" }));
    await page.goto(base);
    assert.equal(await page.getByRole("button", { name: "Reload archive" }).isVisible(), true);
    await page.unroute("**/archive-data.js");
    await page.getByRole("button", { name: "Reload archive" }).click();
    await page.locator(".stack-link").first().waitFor();
    assert.deepEqual(errors, []);
    console.log("Archive browser checks passed: dates/order, preview fan, opening flight, Back, filters, keyboard, 320–1920px, touch, reduced motion, high contrast, load recovery.");
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
