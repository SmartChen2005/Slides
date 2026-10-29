# VR Graffiti

English XR concept presentation with 12 main slides (6:55 in presenter metadata).
The presentation closes with Every Artwork Remembers after Technical Implementation Plan. There are no backup pages.
The superseded Bubble S, guidance, free-space, temporal-art, semester-plan,
References and Discussion pages are removed from the deck and exports.

Open index.html in a browser or from the slide archive. No installation or
server is required. All illustration assets and animations are local.

- Arrows / Page Up / Page Down: navigate.
- Home / End: first / final main slide (Every Artwork Remembers).
- F: fullscreen.
- R: replay. Space: pause/play when a control is not focused.

The deck uses the apple-design skill, native system typography, 1280 x 720
slides, spring navigation, and deterministic Canvas illustrations. The Tools
lesson loops; other animations play once and hold. Reduced motion starts paused
on explanatory frames. Print exports all 12 pages as static slides.

Slides 7-10 introduce Tools, Strokes, Lettering and Create, with a fixed shared
progression row. Spray Can is the protected MVP; Marker and Roller are optional
if time permits. Stroke practice compares ideal control with close, far, slow
and oblique spray conditions. The supplied alphabet remains intact: select a
letter by clicking or using arrow keys while a letter button is focused. Its
Bombing Science link opens further lettering styles in a new tab.

Creative Expression shows concrete, brick and a single front-facing container
wall with three tag samples from the linked Bombing Science article. Static SVG
crops and CSS blending place the original artwork onto each wall. Surface
licenses and tag provenance are recorded in assets/materials/ and assets/tags/.

styles.css owns visual tokens. content.js holds presenter notes. slides.js
and learning.js compose the current slides. motion.js and learning.js render
animations; app.js owns navigation and playback. Image provenance remains in
local asset metadata. Prior unused assets remain available for reuse.
Illustrations describe a concept, without implying prototype results.

Run node scripts/verify_vr_graffiti.cjs with runtime Playwright on NODE_PATH
for browser checks. node scripts/export_vr_graffiti.cjs regenerates the PDF,
speaker-notes.md, thumbnails, and artifacts/vr-graffiti/VR-Graffiti.html.
Then run python scripts/build_archive.py to refresh archive metadata.

The closing One More Thing page presents the proposed artwork-memory research
direction and shows Julie Mehretu’s Stadia II (2004). The full artwork keeps its
original proportions; sources and rights are recorded in assets/artworks/.
