# VR Graffiti design direction

## Learning experience sequence

Slides 7–10 add Tools, Strokes, Lettering and Create directly after the theory
slide. `learning.js` owns these layouts, native letter-selection buttons and
deterministic Canvas illustrations. The shared progress row stays at the same
position and marks the current stage with `aria-current="step"` and blue type.
Tools alone loops, as requested, with a fading seam. Pause, Replay, scrubbing,
background-tab suspension and reduced-motion static frames use the existing
presentation controller. The stroke lesson compares five moving spray cans:
Ideal, Too close, Too far, Too slow and Wrong angle. Growing drips, diffuse
overspray, a slow pass with local buildup and an oblique footprint distinguish
the cases. All results remain visible at the end. The alphabet image remains intact, with selected
grid cells enlarged from the original. No artist stroke order is inferred.
Create develops an original FLOW composition from outline to colored artwork.
Slide 11 is the revised technical plan using Quest 3S, Unity, C# and XRI.
The original three-tools backup is now slide 19. The main deck has 16 slides,
with 10:05 allocated in presenter metadata, followed by three backup slides.

Slide-bottom reference and citation lines are omitted from the rendered deck,
including print and offline exports. Source metadata, presenter notes and the
dedicated References backup retain provenance. Slide 5's two image viewports
are 226px tall to show more of the supplied images, with tighter text spacing
and a lower opportunity statement to preserve clear separation.

This deck uses the apple-design skill as its design source. It does not inherit
Ensemble Mutual's Swiss type, red/green accent system, table rules or motion.
Only the repository's delivery route and 1280 x 720 slide dimensions persist.

The audience is an English-speaking XR course. The main talk now has 16 slides
and 10:05. References, discussion and tools are backups. Notes retain the research,
implementation and scope details that do not belong in the main visual field.

## Visual system

The canonical runtime tokens are `styles.css :root`. White (#ffffff), cool gray
(#f5f5f7), near-black (#1d1d1f), secondary gray (#6e6e73) and teaching blue
(#0071e3) define the light slides. The opening and creative-extension slides
use an almost-black stage (#050507). Violet, pink and peach belong to recorded
paint, not navigation. Type uses the platform system family with optical sizing,
size-specific tracking, and a strong size/weight/leading hierarchy. No Apple
fonts, logos or other proprietary brand assets are bundled.

Most slides use one centered headline and a dominant visual. The opening keeps
only the title and the existing colored S animation. Slide 2, Why Learn Graffiti
in VR?, uses a large two-line statement, with physical skill in teaching blue,
above three unboxed columns for Movement, Distance & Speed, and Lettering.
Its supplied copy remains static and fully visible. Tools use actual product photography.
The learning scene uses one quiet wall,
with its teaching sequence beside it. Dense implementation and reference pages
have clear groups but do not repeat the previous deck's divider-heavy styling.

## Motion system

`motion.js` is a deterministic function of time. It draws paint progressively,
keeps tool poses aligned to the visible paths, fades support, and projects
elapsed stroke time into actual depth coordinates. Canvas runs at 2x resolution.
Tool marks distinguish soft spray deposition, a continuous chisel mark and
broad overlapping roller passes. Product photos remain authentic photographs.

Animations play once and hold. They never snap back into an automatic loop.
The timeline scrubs immediately and supports native keyboard operation. Pause
freezes the current state, Play continues it, and Replay explicitly restarts.

Slide transitions use independent critically damped position and opacity
springs (0.36 s response). Retargeting retains current values and velocities,
so rapid navigation can reverse a transition without jumping or disabling input.
Hidden browser tabs suspend work. Reduced motion starts with explanatory static
frames. Replay/Play is an explicit choice to run the demonstration.

The floating toolbar and non-modal notes pane use restrained translucent
materials. Reduced transparency and higher contrast have solid fallbacks.
Print exports all slides with deterministic frames, original text and links.
The offline HTML embeds the actual photo assets as data URLs.

## Evidence and asset ownership

Research claims and solo project scope retain the supplied content decisions.
No learning results, physical transfer or VR prototype are implied. Actual
photography sources are recorded in `assets/sources.json`, on the tools backup and in
speaker notes. Photo crops preserve the product's labels and proportions.

Slide 3 shows the supplied problem and opportunity with three real photographs:
a graffiti wall, spray cans and a respirator. The wall artwork and respirator
remain uncropped; only the cans photo uses a slight display crop. Sources and
licenses are linked on the slide and recorded in `assets/practice/sources.json`.
The images illustrate the barriers without claiming a particular wall is
unavailable or prescribing protective equipment. Slide 4 is a single centered
sentence in large type, emphasizing structured, repeatable practice with feedback
in teaching blue. These static slides replace the former comparison and lettering
gallery. The lettering module and its assets are retained for future use.

Slides 5 and 6 now continue the rebuilt opening. Existing Solutions & The Gap
uses the two supplied images and a flat two-column comparison, with the project
opportunity below. Feature sources link the official product pages; gap claims
are explicitly attributed to project analysis. From Simulation to Skill Learning
shows Observe, Trace, Reproduce, Remix above three educational theory columns.
Both pages are static. Slide 3's photographs use CSS grayscale for monochrome
display in the browser, PDF and offline export; original assets stay intact.

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

The original three-tools slide remains intact as backup slide 19. Its 13-second
animation and product photo assets are retained; it adds no planned main-talk time.
The hidden SVG used to sample the S path has explicit zero-size clipped inline
styles so global SVG sizing cannot expose its filled path below the presentation.
