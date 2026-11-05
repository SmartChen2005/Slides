/* Export the browser presentation without changing its source content. */
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve('feedback-learning'),out=path.resolve('artifacts/feedback-learning');
fs.mkdirSync(path.join(root,'thumbnails'),{recursive:true});fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||(process.platform==='win32'?'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe':undefined),headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
    await page.goto(pathToFileURL(path.join(root,'index.html')).href,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    for(let i=0;i<11;i++){
      await page.evaluate(i=>{deckAPI.showSlide(i);deckAPI.seek(2.4);deckAPI.settleTransitions();},i);
      await page.locator('.stage').screenshot({path:path.join(out,`slide-${String(i+1).padStart(2,'0')}.png`),animations:'disabled'});
    }
    for(const [i,slide] of [0,4,7].entries()){
      await page.evaluate(i=>{deckAPI.showSlide(i);deckAPI.seek(2.4);deckAPI.settleTransitions();},slide);
      await page.locator('.stage').screenshot({path:path.join(root,'thumbnails',`${String(i+1).padStart(2,'0')}.webp`),type:'webp',quality:85,animations:'disabled'});
    }
    const notes=await page.evaluate(()=>FEEDBACK_DECK.map(s=>({title:s.title,notes:s.notes})));
    fs.writeFileSync(path.join(root,'speaker-notes.md'),'# Feedback & Motor Skill Learning\n\n11 English slides with Chinese speaker notes.\n\n'+notes.map((s,i)=>`## ${i+1}. ${s.title}\n\n${s.notes.join('\n\n')}\n`).join('\n'));
    await page.evaluate(()=>{deckAPI.preparePrint();document.title='Feedback & Motor Skill Learning';});
    await page.emulateMedia({media:'print'});
    await page.pdf({path:path.join(root,'feedback-learning.pdf'),printBackground:true,preferCSSPageSize:true,tagged:true,displayHeaderFooter:false});
    // Single-file review copy; the published deck still uses its local assets.
    let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
    const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
    let content=fs.readFileSync(path.join(root,'content.js'),'utf8');
    content=content.replace(/assets\/[\w-]+\.png/g,file=>`data:image/png;base64,${fs.readFileSync(path.join(root,file)).toString('base64')}`);
    html=html.replace('<link rel="stylesheet" href="styles.css">',`<style>${css}</style>`).replace(/\s*<link rel="stylesheet" href="\.\.\/deck-transition.css">/,'').replace(/\s*<script src="(?:content|app).js" defer><\/script>/g,'').replace('</body>',`<script>${content}</script><script>${fs.readFileSync(path.join(root,'app.js'),'utf8')}</script></body>`);
    fs.writeFileSync(path.join(out,'Feedback-Motor-Skill-Learning.html'),html);
    console.log('Exported 11 slide screenshots, PDF, 3 archive previews, current Chinese notes, and offline HTML.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
