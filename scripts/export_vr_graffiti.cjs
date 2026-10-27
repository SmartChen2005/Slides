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
  const motion = fs.readFileSync(path.join(root, "motion.js"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}\n.standalone .deck-position a { display: none; }</style>`)
    .replace(/\s*<link rel="stylesheet" href="\.\.\/deck-transition.css">/, "")
    .replace(/\s*<script src="(?:content|lettering|slides|motion|app).js" defer><\/script>/g, "")
    .replace("<body>", '<body class="standalone">')
    .replace("</body>", `<script>${content}</script>\n<script>${lettering}</script>\n<script>${data}</script>\n<script>${motion}</script>\n<script>${app}</script>\n</body>`);
  const standalone = path.join(artifacts, "VR-Graffiti.html");
  fs.writeFileSync(standalone, html);
  const executablePath = process.env.BROWSER_EXECUTABLE || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, "index.html")).href, { waitUntil: "networkidle" });
  const deck = await page.evaluate(() => window.GRAFFITI_DECK.map(({ title, seconds, notes, refs, backup }) => ({ title, seconds, notes, refs, backup })));
  const refs = await page.evaluate(() => sources);
  let time = 0;
  let manuscript = "# VR Graffiti: presenter script\n\n12 main slides, 7:50 planned talk. Two backup slides support 3–5 minutes of Q&A.\n\nOpen index.html or the self-contained HTML in a browser. Arrow keys navigate. N opens these notes, R replays, Space pauses and F opens fullscreen. End opens the last main slide.\n\n";
  deck.forEach((slide, index) => {
    manuscript += `## ${index + 1}. ${slide.title}${slide.backup ? " (Backup)" : ""}\n\n${slide.notes.join("\n\n")}\n\n`;
    if (slide.refs.length) manuscript += slide.refs.map(key => `[${refs[key][1]}](${refs[key][0]})`).join(". ") + "\n\n";
    time += slide.seconds;
  });
  fs.writeFileSync(path.join(root, "speaker-notes.md"), manuscript);
  for (const [i, slide] of [0, 6, 9].entries()) {
    await page.evaluate(index => { deckAPI.showSlide(index); deckAPI.seek(GraffitiMotion.staticTimes[index]); deckAPI.settleTransitions(); }, slide);
    await page.locator(".stage").screenshot({ path: path.join(root, "thumbnails", `0${i + 1}.webp`), type: "webp", quality: 85, animations: "disabled" });
  }
  await page.evaluate(() => deckAPI.preparePrint());
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: path.join(pdfRoot, "VR-Graffiti-Concept.pdf"), printBackground: true, preferCSSPageSize: true, tagged: true, displayHeaderFooter: false });
  // Confirm the single-file deliverable boots without adjacent files or a server.
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ media: "screen" });
  await page.goto(pathToFileURL(standalone).href, { waitUntil: "networkidle" });
  if (errors.length || await page.locator(".slide").count() !== deck.length) throw new Error(`Standalone export failed: ${errors}`);
  await page.evaluate(() => { deckAPI.showSlide(3); deckAPI.seek(17.5); deckAPI.settleTransitions(); });
  for (const key of ["handstyle", "bubble", "wildstyle"]) {
    await page.locator(`[data-reference="${key}"]`).click();
    const valid = await page.locator("#reference-image").evaluate(node => node.src.startsWith("data:image/") && node.complete && node.naturalWidth > 0);
    if (!valid) throw new Error(`Offline lettering reference failed: ${key}`);
    await page.locator("#reference-close").click();
  }
  await page.screenshot({ path: path.join(artifacts, "qa", "standalone-lettering.png"), animations: "disabled" });
  await page.evaluate(() => { deckAPI.showSlide(9); deckAPI.seek(12); deckAPI.settleTransitions(); });
  await page.screenshot({ path: path.join(artifacts, "qa", "standalone.png"), animations: "disabled" });
  console.log(JSON.stringify({ standalone, pdf: path.join(pdfRoot, "VR-Graffiti-Concept.pdf"), slides: deck.length, mainSeconds: time, mainScriptWords: deck.filter(s => !s.backup).map(s => s.notes.join(" ")).join(" ").split(/\s+/).length, standaloneErrors: errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
