# VR Graffiti

English concept presentation for the XR skill-learning assignment. The main
talk has 16 slides paced to 10:05, followed by reference and Q&A backups.

Open `index.html` in a browser or open this deck from the slide archive. No
install or server is required. All diagrams and animations are local.

- Arrow keys / Page Up / Page Down: navigate
- Home / End: first / final main slide
- N: presenter notes
- R: replay the current animation
- Space: pause or play (when a control is not focused)
- F: fullscreen
- Drag the animation timeline to inspect an intermediate frame

Animations play once and hold their final state, except the looping Tools lesson. Replay restarts the motion,
and Play continues from the paused frame.

The final main slide's Next button opens References, then Discussion. Notes
include the speaker script and source links. `speaker-notes.md` is the separate
rehearsal manuscript. Reduced motion starts with paused explanatory frames.
The browser's print command shows all 19 slides as static pages.

The provided brief supplies the concept and proposed solo scope. Course
expectations govern coverage. Research sources inform design choices and do
not establish learning benefits or transfer for the proposed application.
All moving diagrams are concept illustrations, not recordings of a prototype.
The semester deadline and presentation date remain unspecified.

The deck has its own Apple-inspired visual and motion system, using the
apple-design skill. It retains the archive route and 1280 × 720 dimensions.
The cover contains only the title and colored S animation. Slide 2 asks
Why Learn Graffiti in VR? and explains the coordination of movement, distance
and speed, and lettering with a large statement and three text columns.
`styles.css` owns the visual tokens. `content.js` holds the speaker script,
`slides.js` composes the slides, `motion.js` renders deterministic interaction
visualizations, and `app.js` owns playback and interruptible spring navigation.
Real tool photography is credited in `assets/sources.json` and the slides.

Slide 3 pairs practice barriers with actual photographs of a wall, spray cans
and a respirator, followed by the VR opportunity. Sources and licenses are
linked on the slide and recorded in `assets/practice/sources.json`.
Slide 4 contains one sentence about the need for structured, repeatable
practice with feedback. The former tool comparison and lettering gallery
have been replaced as part of the opening-page rebuild. `lettering.js` and
its assets remain available for later curriculum pages.

To regenerate local deliverables with the bundled Playwright package available
on `NODE_PATH`, run `node scripts/export_vr_graffiti.cjs` from the repository
root. It creates the submission PDF at `output/pdf/VR-Graffiti-Concept.pdf`
and the offline single-file deck at `artifacts/vr-graffiti/VR-Graffiti.html`.
Then run `python scripts/build_archive.py` to refresh the archive thumbnails.
`scripts/verify_vr_graffiti.cjs` exercises the browser presentation controls.

Slide 3's three photographs now display in monochrome. Slide 5 compares
Kingspray Graffiti VR and Vermillion VR using the supplied images, then states
the learning opportunity. Slide 6 presents Observe, Trace, Reproduce, Remix
and the three theories: Observational Learning, Scaffolding, Constructionism.
Image provenance is recorded in `assets/solutions/sources.json`.

The former slide 5 introduced the proposed learning environment: a concrete virtual studio
with a practice wall, nearby tools and a creative playground. The real interior
photograph is Tadao Ando’s Langen Foundation, by Till Niermann (CC BY 3.0).
It references material and light; it does not depict the proposed VR layout.
Original source metadata is in `assets/architecture/source-metadata.json`.

Slide 9 is Free Space to Practice: players create walls of different sizes,
move and rotate them, and build a personal layout. A projected 3D animation
shows surface creation, arrangement and a gesture leaving a wall for open space.
Editable walls belong to the core playground; spatial strokes are a creative
extension. Slide 10, Beyond Traditional 3D Art, develops time-based artwork.
The former evaluation-pilot slide has been removed.

The original Three tools. Different control. page is retained as the final backup
(slide 19), including the original product photos, control labels and animations.

Slides 7–10 introduce Tools, Strokes, Lettering and Create. All four share a
fixed progression row. Tools loops; the other motion studies play once and hold.
The alphabet chart is the supplied original. Click a grid cell, or use arrow keys
while a letter is focused, to select and enlarge its detail. Reduced motion
starts on explanatory stills. learning.js owns the new layouts and illustrations.
The revised Technical Implementation Plan follows at slide 11.
