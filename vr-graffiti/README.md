# VR Graffiti

English concept presentation for the XR skill-learning assignment. The main
talk has 11 slides paced to 7:30, followed by reference and Q&A backups.

Open `index.html` in a browser or open this deck from the slide archive. No
install or server is required. All diagrams and animations are local.

- Arrow keys / Page Up / Page Down: navigate
- Home / End: first / final main slide
- N: presenter notes
- R: replay the current animation
- Space: pause or play (when a control is not focused)
- F: fullscreen
- Drag the animation timeline to inspect an intermediate frame

Animations play once and hold their final state. Replay restarts the motion,
and Play continues from the paused frame.

The final main slide's Next button opens References, then Discussion. Notes
include the speaker script and source links. `speaker-notes.md` is the separate
rehearsal manuscript. Reduced motion starts with paused explanatory frames.
The browser's print command shows all 13 slides as static pages.

The provided brief supplies the concept and proposed solo scope. Course
expectations govern coverage. Research sources inform design choices and do
not establish learning benefits or transfer for the proposed application.
All moving diagrams are concept illustrations, not recordings of a prototype.
The semester deadline and presentation date remain unspecified.

The deck has its own Apple-inspired visual and motion system, using the
apple-design skill. It retains the archive route and 1280 × 720 dimensions.
`styles.css` owns the visual tokens. `content.js` holds the speaker script,
`slides.js` composes the slides, `motion.js` renders deterministic interaction
visualizations, and `app.js` owns playback and interruptible spring navigation.
Real tool photography is credited in `assets/sources.json` and the slides.

Slide 4 pairs each lettering family with a real-world photo and an animated
word construction study. Select a reference to inspect its full photograph;
the lesson pauses at the current frame. Photo credits and license links appear
below each reference, with metadata in `assets/lettering/sources.json`.
`lettering.js` owns these teaching studies and the accessible reference viewer.

To regenerate local deliverables with the bundled Playwright package available
on `NODE_PATH`, run `node scripts/export_vr_graffiti.cjs` from the repository
root. It creates the submission PDF at `output/pdf/VR-Graffiti-Concept.pdf`
and the offline single-file deck at `artifacts/vr-graffiti/VR-Graffiti.html`.
Then run `python scripts/build_archive.py` to refresh the archive thumbnails.
`scripts/verify_vr_graffiti.cjs` exercises the browser presentation controls.
