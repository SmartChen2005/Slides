"use strict";

const S_PATH = "M285 65C250 12 98 25 101 107C104 165 282 143 279 223C277 307 119 319 83 257";
const sourceLink = (href,label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const sources = {
  han:["https://doi.org/10.3390/ijerph191610109","Han et al., 2022"],
  levac:["https://doi.org/10.1186/s12984-019-0587-8","Levac et al., 2019"],
  yu:["https://doi.org/10.1145/3613904.3642143","Yu et al., CHI 2024"],
  wulf:["https://doi.org/10.1111/j.1365-2923.2009.03421.x","Wulf et al., 2010"],
  king:["https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/","Kingspray, official PC description"],
  vermillion:["https://vermillion-vr.com/","Vermillion, official website"],
  brush:["https://openbrush.app/","Open Brush"],
  krylon:["https://www.krylon.com/en/how-to/how-to-spray-paint","Krylon, How to Spray Paint"],
  unity:["https://docs.unity.com/en-us/engine/6000.0/manual/xr/configuring-project-for/scene-setup/input-overview","Unity, XR input options"],
  sprayPhoto:["https://www.montana-cans.com/Montana-BLACK-400ml/272073","Montana Cans product photography"],
  markerPhoto:["https://www.sprayplanet.com/products/mtn-street-paint-markers-15mm-orange","MTN / Spray Planet product photography"],
  spacePhoto:["https://commons.wikimedia.org/wiki/File:Langen_Foundation_3,_2021.jpg","Langen Foundation, photo: Till Niermann"],
  rollerPhoto:["https://www.purdy.co.uk/products/rollers/mini-roller-system/","Purdy product photography"],
  practiceWall:["https://commons.wikimedia.org/wiki/File:Graffiti_Mauerpark_Berlin.jpg","Wall: Singlespeedfahrer"],
  practiceCans:["https://commons.wikimedia.org/wiki/File:Spray_cans_in_front_of_graffiti_(Unsplash).jpg","Cans: Chris Barbalis"],
  practiceMask:["https://commons.wikimedia.org/wiki/File:HEPA_half-face_respirator.jpg","Mask: Haragayato"]
};
const cite = (...keys) => keys.map(key=>sourceLink(...sources[key])).join(". ");
const svg = (body,label,viewBox="0 0 800 426") => `<svg viewBox="${viewBox}" role="img" aria-label="${label}">${body}</svg>`;
const curve = (cls,attributes="") => `<path class="${cls}" d="${S_PATH}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${attributes}/>`;
const canvas = (id,w,h,label,cls="") => `<canvas id="${id}" width="${w*2}" height="${h*2}" class="${cls}" role="img" aria-label="${label}">${label}</canvas>`;
const tool = (id,grip=false) => `<defs><linearGradient id="${id}-metal"><stop stop-color="#f8f8fa"/><stop offset=".35" stop-color="#d5d9df"/><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#a9b1bd"/></linearGradient></defs>${grip?'<path d="M14 16C31 11 46 20 44 32L36 52L12 70L-9 60L-16 42Q-20 30-12 24L0 18L8 24L-2 34L5 43L14 35Z" fill="#d8e9fd" stroke="#77aee8" stroke-width="1.5"/>':''}<rect x="-13" y="8" width="27" height="51" rx="8" fill="url(#${id}-metal)" stroke="#8c98a8" stroke-width="1"/><path d="M-8 8V2H9V8" fill="#343b46"/><rect x="-3" y="-3" width="12" height="6" rx="2" fill="#384456"/><rect x="-9" y="23" width="19" height="21" rx="3" fill="#0071e3" opacity=".9"/><path d="M-7 49H8" stroke="#aab1bb"/>`;
const footer = text => `<p class="cite">${text}</p>`;

Object.assign(sources,Object.fromEntries(GraffitiLettering.refs.map(r=>[r.sourceKey,[r.page,r.work+" (photo: "+r.creator+")"]])));
const layouts = [
  {
    title:"VR Graffiti", theme:"dark", duration:7,
    html:`<h1 class="hero-title">VR Graffiti</h1><figure class="hero-scene">${canvas("hero-motion",1080,360,"A recorded graffiti gesture draws into a sculptural ribbon of color")}</figure>`
  },
  {
    title:"Why Learn Graffiti in VR?", theme:"why-slide", duration:0,
    html:`<h2 class="why-title">Why Learn Graffiti in VR?</h2><p class="why-statement">Graffiti is a <strong class="accent">physical skill,</strong><br>not just a visual art.</p><p class="why-intro">Learning graffiti requires coordination between:</p><ul class="why-skills"><li><h3>Movement</h3><p>controlling hand trajectories and smooth strokes.</p></li><li><h3>Distance &amp; Speed</h3><p>adjusting spray width, opacity, and consistency.</p></li><li><h3>Lettering</h3><p>understanding letter structure, proportions, and styles.</p></li></ul>`
  },
  {
    title:"The problem and the opportunity", theme:"barriers-slide", duration:0,
    html:`<h2 class="centered">The problem</h2><p class="barriers-intro">Beginners face barriers to practicing consistently, including:</p><div class="barriers-gallery"><figure><img class="barrier-photo wall-photo" src="assets/practice/wall.jpg" width="1280" height="868" alt="A concrete wall covered in colorful graffiti in Berlin's Mauerpark"><figcaption>Limited access to<br>appropriate spaces</figcaption></figure><figure><img class="barrier-photo" src="assets/practice/spray-cans.jpg" width="1280" height="847" alt="Multiple spray paint cans arranged in front of a graffiti wall"><figcaption>Material costs</figcaption></figure><figure><img class="barrier-photo mask-photo" src="assets/practice/respirator.jpg" width="1485" height="1125" alt="A reusable half-face respirator with two filter cartridges"><figcaption>Safety considerations</figcaption></figure></div><div class="practice-opportunity"><h3>The opportunity</h3><p>VR can provide an accessible, repeatable environment<br>for learning and experimenting with graffiti techniques.</p></div>${footer(cite("practiceWall","practiceCans")+" ("+sourceLink("https://creativecommons.org/publicdomain/zero/1.0/","CC0")+"). "+cite("practiceMask")+" ("+sourceLink("https://creativecommons.org/licenses/by-sa/3.0/","CC BY-SA 3.0")+"). Monochrome display; cans cropped.")}`
  },
  {
    title:"Structured, repeatable practice with feedback", theme:"thesis-slide", duration:0,
    html:`<p class="thesis-copy">Graffiti combines artistic expression with embodied motor skills, but beginners rarely have access to <strong class="accent">structured, repeatable practice with feedback.</strong></p>`
  },
  {
    title:"Existing Solutions & The Gap", theme:"solutions-slide", duration:0,
    html:`<h2>Existing Solutions &amp; The Gap</h2><div class="solutions-grid"><article class="solution"><img class="solution-image" src="assets/solutions/kingspray.png" alt="Kingspray Graffiti VR screenshot supplied by the presenter"><h3>Kingspray Graffiti VR</h3><p class="solution-features">Realistic spray physics, multiple caps, multiplayer painting, and reference projection.</p><p><strong>Tutorials focus on application features rather than graffiti techniques or artistic fundamentals.</strong></p><p class="solution-gap"><strong>Gap:</strong> Primarily a creative simulation tool, better suited to experienced artists than complete beginners.</p></article><article class="solution"><img class="solution-image" src="assets/solutions/vermillion.png" alt="Vermillion VR demonstration image supplied by the presenter"><h3>Vermillion VR</h3><p class="solution-features">Realistic oil painting, guided tutorials, reference tracing, and color mixing.</p><p class="solution-gap"><strong>Gap:</strong> Focuses on traditional painting rather than graffiti-specific techniques and lettering.</p></article></div><div class="solutions-opportunity"><h3>Our Opportunity</h3><p>A beginner-oriented VR learning environment with structured instruction,<br>progressive skill development, and measurable feedback.</p></div>${footer(cite("king","vermillion")+". Images supplied by presenter. Gap statements reflect our project analysis.")}`
  },
  {
    title:"From Simulation to Skill Learning", theme:"theory-slide", duration:0,
    html:`<h2>From Simulation to Skill Learning</h2><p class="learning-sequence" aria-label="Observe, then Trace, then Reproduce, then Remix">Observe <span aria-hidden="true">→</span> Trace <span aria-hidden="true">→</span> Reproduce <span aria-hidden="true">→</span> Remix</p><p class="theory-intro">Our learning experience draws on three educational theories:</p><div class="theory-grid"><div><h3>Observational Learning</h3><p>Observe and imitate an expert's hand movements through an animated virtual hand.</p></div><div><h3>Scaffolding</h3><p>Gradually remove visual guides and assistance as learners gain proficiency.</p></div><div><h3>Constructionism</h3><p>Develop understanding by creating personalized graffiti and experimenting with different styles.</p></div></div><p class="theory-closing">From imitation to independent creation.</p>`
  },
  {
    title:"Technical Implementation Plan",theme:"technical-plan",duration:0,
    html:`<h2 class="centered">Technical Implementation Plan</h2><div class="technical-columns"><div class="technical-platform"><h3>Hardware &amp; Software</h3><p class="technical-device">Meta Quest 3S</p><p class="technical-stack">Unity<br>C#<br>XR Interaction Toolkit</p></div><div class="technical-core"><h3>Core Implementation</h3><div><h4>Track movement</h4><p>Track hand position, angle, speed,<br>and distance from the wall.</p></div><div><h4>Simulate spray</h4><p>Simulate realistic spray behavior<br>based on movement.</p></div><div><h4>Record &amp; replay</h4><p>Record and replay expert movements<br>for guided practice.</p></div></div></div>`
  },
  {
    title:"Every Artwork Remembers",theme:"memory-slide",duration:0,
    html:`<p class="memory-kicker">One More Thing...</p><h2>Every Artwork Remembers</h2><div class="memory-copy"><p class="memory-prompt">What if an artwork could remember how it was created?</p><p>VR Graffiti captures more than the final painting. It records the artist's <strong>movements, gestures, timing, pauses, and revisions.</strong></p><p>These creative traces are transformed into an explorable <strong class="accent">3D abstract artwork,</strong> inspired by the layered, dynamic compositions of <strong>Julie Mehretu.</strong></p><p>Others can enter the artwork, replay the creative process, and remix it with their own movements.</p></div><figure class="memory-artwork"><img src="assets/artworks/julie-mehretu-stadia-ii.jpg" alt="Julie Mehretu's Stadia II, 2004: layered architectural lines, gestural marks and colorful geometric shapes"><figcaption>Julie Mehretu · <em>Stadia II</em>, 2004</figcaption></figure><div class="memory-research"><p class="memory-research-label">Research Question</p><p>Can an artwork become a medium for <strong>transmitting embodied knowledge?</strong></p></div>`
  }

];
layouts.splice(6,0,...GraffitiLearning.layouts);
window.GRAFFITI_DECK = window.GRAFFITI_CONTENT.map((content,index)=>({...content,...layouts[index],html:layouts[index].html.replace(/<p class="(?:cite|photo-references)">[\s\S]*?<\/p>/g,"" )}));
