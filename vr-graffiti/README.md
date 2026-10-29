# VR Graffiti

English XR concept presentation with 11 main slides (6:10 in presenter metadata).
The presentation ends with Technical Implementation Plan. There are no backup pages.
The superseded Bubble S, guidance, free-space, temporal-art, semester-plan,
References and Discussion pages are removed from the deck and exports.

Open index.html in a browser or from the slide archive. No installation or
server is required. All illustration assets and animations are local.

- Arrows / Page Up / Page Down: navigate.
- Home / End: first / final main slide (Technical Implementation Plan).
- F: fullscreen.
- R: replay. Space: pause/play when a control is not focused.

The deck uses the apple-design skill, native system typography, 1280 x 720
slides, spring navigation, and deterministic Canvas illustrations. The Tools
lesson loops; other animations play once and hold. Reduced motion starts paused
on explanatory frames. Print exports all 11 pages as static slides.

Slides 7-10 introduce Tools, Strokes, Lettering and Create, with a fixed shared
progression row. Spray Can is the protected MVP; Marker and Roller are optional
if time permits. Stroke practice compares ideal control with close, far, slow
and oblique spray conditions. The supplied alphabet remains intact: select a
letter by clicking or using arrow keys while a letter button is focused. Its
Bombing Science link opens further lettering styles in a new tab.

Creative Expression shows three static wall-material photographs: concrete,
brick and a shipping container. It has no interactive sandbox. The photographs and their public-domain
source records are stored in assets/materials/.

styles.css owns visual tokens. content.js holds presenter notes. slides.js
and learning.js compose the current slides. motion.js and learning.js render
animations; app.js owns navigation and playback. Image provenance remains in
local asset metadata. Prior unused assets remain available for reuse.
Illustrations describe a concept, without implying prototype results.

Run node scripts/verify_vr_graffiti.cjs with runtime Playwright on NODE_PATH
for browser checks. node scripts/export_vr_graffiti.cjs regenerates the PDF,
speaker-notes.md, thumbnails, and artifacts/vr-graffiti/VR-Graffiti.html.
Then run python scripts/build_archive.py to refresh archive metadata.
