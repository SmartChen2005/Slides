# VR Graffiti design direction

This deck uses the apple-design skill as its design source. It does not inherit
Ensemble Mutual's Swiss type, red/green accent system, table rules or motion.
Only the repository's delivery route and 1280 x 720 slide dimensions persist.

The audience is an English-speaking XR course. The main talk remains 12 slides
and 7:50. References and discussion are backups. Notes retain the research,
implementation and scope details that do not belong in the main visual field.

## Visual system

The canonical runtime tokens are `styles.css :root`. White (#ffffff), cool gray
(#f5f5f7), near-black (#1d1d1f), secondary gray (#6e6e73) and teaching blue
(#0071e3) define the light slides. The opening and creative-extension slides
use an almost-black stage (#050507). Violet, pink and peach belong to recorded
paint, not navigation. Type uses the platform system family with optical sizing,
size-specific tracking, and a strong size/weight/leading hierarchy. No Apple
fonts, logos or other proprietary brand assets are bundled.

Most slides use one centered headline and a dominant visual. The problem uses
an asymmetric headline and motion study. Tools use actual product photography.
Comparisons stay an editable table. The learning scene uses one quiet wall,
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
photography sources are recorded in `assets/sources.json`, on slide 6 and in
speaker notes. Photo crops preserve the product's labels and proportions.

Slide 4 introduces different lettering styles with photographs and whole-word construction
studies: Handstyle/YANK, Bubble/SPLEEN and a FLOW Wildstyle study.
The animations teach signature rhythm, inflated contours,
and letter skeletons with overlaps. They do not reconstruct the photographed
artists' actual stroke order. Each photo links its original source and license.
The reference viewer pauses playback, shows the full photo, closes with Escape,
and restores focus. `lettering.js` owns this feature. Its original construction
studies remain separate from the credited photographic reference assets.

Slide 5 introduces the proposed learning environment: a concrete virtual studio
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
