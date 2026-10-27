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
  const data = fs.readFileSync(path.join(root, "slides.js"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}\n.standalone .deck-position a { display: none; }</style>`)
    .replace(/\s*<link rel="stylesheet" href="\.\.\/deck-transition.css">/, "")
    .replace(/\s*<script src="(?:slides|app).js" defer><\/script>/g, "")
    .replace("<body>", '<body class="standalone">')
    .replace("</body>", `<script>${data}</script>\n<script>${app}</script>\n</body>`);
  const standalone = path.join(artifacts, "VR-Graffiti.html");
  fs.writeFileSync(standalone, html);
  const executablePath = process.env.BROWSER_EXECUTABLE || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, "index.html")).href, { waitUntil: "networkidle" });
  const deck = await page.evaluate(() => window.GRAFFITI_DECK.map(({ title, seconds, notes, refs, backup }) => ({ title, seconds, notes, refs, backup })));
  const refs = await page.evaluate(() => sources);
  let time = 0;
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  let manuscript = "# VR Graffiti: presenter script\n\n11 main slides, 7:30 planned talk. Two backup slides support 3–5 minutes of Q&A.\n\nOpen index.html or the self-contained HTML in a browser. Arrow keys navigate. N opens these notes, R replays, Space pauses and F opens fullscreen. End opens the last main slide.\n\n";
  deck.forEach((slide, index) => {
    const timing = slide.backup ? "Backup" : `${formatTime(time)}–${formatTime(time + slide.seconds)}`;
    manuscript += `## ${index + 1}. ${slide.title} (${timing})\n\n${slide.notes.join("\n\n")}\n\n`;
    if (slide.refs.length) manuscript += slide.refs.map(key => `[${refs[key][1]}](${refs[key][0]})`).join(". ") + "\n\n";
    time += slide.seconds;
  });
  fs.writeFileSync(path.join(root, "speaker-notes.md"), manuscript);
  for (const [i, slide] of [0, 5, 8].entries()) {
    await page.evaluate(index => { deckAPI.showSlide(index); deckAPI.seek(index === 5 ? 3.1 : 6); }, slide);
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
  if (errors.length || await page.locator(".slide").count() !== 13) throw new Error(`Standalone export failed: ${errors}`);
  await page.evaluate(() => { deckAPI.showSlide(8); deckAPI.seek(6); });
  await page.screenshot({ path: path.join(artifacts, "qa", "standalone.png"), animations: "disabled" });
  console.log(JSON.stringify({ standalone, pdf: path.join(pdfRoot, "VR-Graffiti-Concept.pdf"), slides: deck.length, mainSeconds: time, mainScriptWords: deck.filter(s => !s.backup).map(s => s.notes.join(" ")).join(" ").split(/\s+/).length, standaloneErrors: errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
