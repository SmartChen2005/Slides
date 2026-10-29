# TAG! design direction

## Learning experience sequence

Spray Can is the protected MVP tool, marked with an asterisk on Learning the
Tools. Marker and Roller are optional extensions, time permitting. The note
sits above the shared progression row. Roadmap and discussion scope agree
with this priority; the learning-tool animations remain available.

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
The lettering detail area includes a native external link to the presenter’s
Bombing Science style resource, opening in a new tab beside the enlarged image.
Creative Expression is a static gallery of concrete, brick and a single
front-facing shipping-container wall. Three original tag samples from the linked
Bombing Science article are cropped with native SVG and blended onto the walls.
The container shows only one planar face; no corner, door face or surrounding scene. It has no drawing controls, material selectors or animation.
The existing title, supporting sentence and 04 Create progression remain.
Slide 11 is the revised technical plan using Quest 3S, Unity, C# and XRI.
The deck has 12 slides, with 6:55 allocated in presenter metadata and no backups.

Slide-bottom reference and citation lines are omitted from the rendered deck,
including print and offline exports. Source metadata, presenter notes and the
retained source metadata retain provenance. Slide 5's two image viewports
are 226px tall to show more of the supplied images, with tighter text spacing
and a lower opportunity statement to preserve clear separation.

This deck uses the apple-design skill as its design source. It does not inherit
Ensemble Mutual's Swiss type, red/green accent system, table rules or motion.
Only the repository's delivery route and 1280 x 720 slide dimensions persist.

The audience is an English-speaking XR course. The main talk now has 12 slides
and 6:55. There are no backup pages. Source notes retain the research,
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
the TAG! title, the subtitle Learn the Art of Graffiti in VR, and an original
Canvas spray animation in cover.js. The viewer
is the wall: the can’s front-facing nozzle sprays toward the camera while the
can sweeps laterally and changes distance. Expanding airborne particles travel
toward the screen; deposited pigment stays fixed in front of the moving tool.
The eight-second animation plays once and holds. The S and still-life cover
are removed. Print and reduced motion use an explanatory mid-spray frame. Slide 2, Why Learn Graffiti
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

The floating toolbar uses restrained translucent materials. The notes button,
panel and N shortcut are removed from the presentation UI. Reduced transparency and higher contrast have solid fallbacks.
Print exports all slides with deterministic frames, original text and links.
The offline HTML embeds the actual photo assets as data URLs.

## Evidence and asset ownership

Research claims and solo project scope retain the supplied content decisions.
No learning results, physical transfer or VR prototype are implied. Actual
photography sources are recorded in `assets/sources.json`, and in
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

The original three-tools backup is removed from the deck and all exports.
Its unused product photo assets remain available in the source folder.
The hidden SVG used to sample the S path has explicit zero-size clipped inline
styles so global SVG sizing cannot expose its filled path below the presentation.

Technical Implementation Plan is slide 11, followed by Every Artwork Remembers. The old
Bubble S lesson, guidance layers, free-space study, temporal art, semester plan,
References and Discussion pages have been removed from the deck and exports.
There are no resource backup pages.

## Closing research direction

Slide 12 uses the supplied One More Thing — kicker and Every Artwork Remembers
title. The concise closing copy asks whether the system could preserve the
creative process and describes movements, pauses and revisions as an explorable
3D abstract artwork: a spatial memory of its creation. The earlier research
question and extra paragraphs are removed. On the right, Julie Mehretu’s
Stadia II (2004) stays whole with its aspect ratio preserved and a short caption.
This static slide ends the main deck. Artwork provenance is recorded in
assets/artworks/sources.json and the source notes.
