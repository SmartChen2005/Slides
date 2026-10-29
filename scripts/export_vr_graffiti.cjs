/* Export the existing HTML deck. Requires Playwright from the bundled runtime. */
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const root = path.resolve("vr-graffiti");
const artifacts = path.resolve("artifacts/vr-graffiti");
const pdfRoot = path.resolve("output/pdf");
fs.mkdirSync(artifacts, { recursive: true });
fs.mkdirSync(pdfRoot, { recursive: true });
fs.mkdirSync(path.join(root, "thumbnails"), { recursive: true });

(async () => {
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  const content = fs.readFileSync(path.join(root, "content.js"), "utf8");
  const embedAssets = source => source.replace(/(["'])assets\/([^"']+\.(?:jpe?g|png|webp))\1/g, (_, quote, filename) => JSON.stringify(`data:image/${/\.png$/i.test(filename) ? "png" : /\.webp$/i.test(filename) ? "webp" : "jpeg"};base64,${fs.readFileSync(path.join(root, "assets", filename)).toString("base64")}`));
  const data = embedAssets(fs.readFileSync(path.join(root, "slides.js"), "utf8"));
  const lettering = embedAssets(fs.readFileSync(path.join(root, "lettering.js"), "utf8"));
  const learning = embedAssets(fs.readFileSync(path.join(root, "learning.js"), "utf8"));
  const motion = fs.readFileSync(path.join(root, "motion.js"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}\n.standalone .deck-position a { display: none; }</style>`)
    .replace(/\s*<link rel="stylesheet" href="\.\.\/deck-transition.css">/, "")
    .replace(/\s*<script src="(?:content|lettering|learning|slides|motion|app).js" defer><\/script>/g, "")
    .replace("<body>", '<body class="standalone">')
    .replace("</body>", `<script>${content}</script>\n<script>${lettering}</script>\n<script>${learning}</script>\n<script>${data}</script>\n<script>${motion}</script>\n<script>${app}</script>\n</body>`);
  const standalone = path.join(artifacts, "VR-Graffiti.html");
  fs.writeFileSync(standalone, html);
  const executablePath = process.env.BROWSER_EXECUTABLE || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, "index.html")).href, { waitUntil: "networkidle" });
  const deck = await page.evaluate(() => window.GRAFFITI_DECK.map(({ title, seconds, notes, refs, backup }) => ({ title, seconds, notes, refs, backup })));
  const refs = await page.evaluate(() => sources);
  let time = 0;
  let manuscript = "# VR Graffiti: presenter script\n\n11 slides, 6:10 planned talk. The presentation ends with Technical Implementation Plan.\n\nOpen index.html or the self-contained HTML in a browser. Arrow keys navigate. R replays, Space pauses and F opens fullscreen. End opens the last main slide.\n\n";
  deck.forEach((slide, index) => {
    manuscript += `## ${index + 1}. ${slide.title}${slide.backup ? " (Backup)" : ""}\n\n${slide.notes.join("\n\n")}\n\n`;
    if (slide.refs.length) manuscript += slide.refs.map(key => `[${refs[key][1]}](${refs[key][0]})`).join(". ") + "\n\n";
    time += slide.seconds;
  });
  fs.writeFileSync(path.join(root, "speaker-notes.md"), manuscript);
  for (const [i, slide] of [0, 1, 2].entries()) {
    await page.evaluate(index => { deckAPI.showSlide(index); deckAPI.seek(GraffitiMotion.staticTimes[index]); deckAPI.settleTransitions(); }, slide);
    await page.locator(".stage").screenshot({ path: path.join(root, "thumbnails", `0${i + 1}.webp`), type: "webp", quality: 85, animations: "disabled" });
  }
  await page.evaluate(() => { deckAPI.preparePrint(); document.title = 'VR Graffiti'; });
  await page.emulateMedia({ media: "print" });
  // Preserve the browser-rendered canvas pixels in PDF, including clipped 3D materials.
  await page.evaluate(async () => {
    for (const node of document.querySelectorAll("canvas")) {
      const size = getComputedStyle(node), snapshot = new Image();
      snapshot.src = node.toDataURL("image/png");
      snapshot.alt = node.getAttribute("aria-label") || node.textContent;
      snapshot.className = node.className;
      snapshot.style.width = size.width; snapshot.style.height = size.height;
      await snapshot.decode(); node.replaceWith(snapshot);
    }
  });
  const pdfBytes = await page.pdf({ printBackground: true, preferCSSPageSize: true, tagged: true, displayHeaderFooter: false });
  const pdfPath = path.join(pdfRoot, "VR-Graffiti-Concept.pdf");
  // Update the existing synced file in place; some OneDrive files reject open-with-truncate.
  const pdfHandle = fs.openSync(pdfPath, fs.existsSync(pdfPath) ? "r+" : "w");
  try { fs.writeFileSync(pdfHandle, pdfBytes); fs.ftruncateSync(pdfHandle, pdfBytes.length); }
  finally { fs.closeSync(pdfHandle); }
  // Confirm the single-file deliverable boots without adjacent files or a server.
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(standalone).href, { waitUntil: "networkidle" });
  if (errors.length || await page.locator(".slide").count() !== deck.length) throw new Error(`Standalone export failed: ${errors}`);
  await page.evaluate(() => { deckAPI.showSlide(2); deckAPI.settleTransitions(); });
  const photos = await page.locator('.barriers-gallery img').evaluateAll(nodes => nodes.map(node => node.src.startsWith('data:image/') && node.complete && node.naturalWidth > 0));
  if (photos.length !== 3 || photos.some(valid => !valid)) throw new Error('Offline practice photo failed');
  await page.screenshot({ path: path.join(artifacts, "qa", "standalone-barriers.png"), animations: "disabled" });
  await page.evaluate(() => { deckAPI.showSlide(3); deckAPI.settleTransitions(); });
  await page.screenshot({ path: path.join(artifacts, "qa", "standalone-statement.png"), animations: "disabled" });
  await page.evaluate(() => { deckAPI.showSlide(8); deckAPI.settleTransitions(); });
  const alphabetOffline = await page.locator('.alphabet-reference>img').evaluate(node => node.src.startsWith('data:image/') && node.complete && node.naturalWidth === 540);
  if (!alphabetOffline) throw new Error('Offline alphabet reference failed');
  await page.locator('[data-letter="25"]').click();
  if (await page.locator('#selected-letter').textContent() !== 'Letter Z') throw new Error('Offline alphabet selection failed');
  await page.screenshot({path:path.join(artifacts,'qa','standalone-learning.png')});
  await page.evaluate(()=>{deckAPI.showSlide(9);deckAPI.seek(12);deckAPI.settleTransitions();});
  const wallsOffline=await page.locator('.wall-materials img').evaluateAll(nodes=>nodes.map(node=>node.src.startsWith('data:image/')&&node.complete&&node.naturalWidth>0));
  if(wallsOffline.length!==3||wallsOffline.some(valid=>!valid))throw new Error('Offline wall photos failed');
  await page.screenshot({path:path.join(artifacts,'qa','standalone-material-photos.png')});
  console.log(JSON.stringify({ standalone, pdf: path.join(pdfRoot, "VR-Graffiti-Concept.pdf"), slides: deck.length, mainSeconds: time, mainScriptWords: deck.filter(s => !s.backup).map(s => s.notes.join(" ")).join(" ").split(/\s+/).length, standaloneErrors: errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
