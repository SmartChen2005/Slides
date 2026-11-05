# Feedback & Motor Skill Learning

## Intent

An 11-slide research presentation for classmates learning motor skill feedback. English projection with Chinese preparation notes. Slides 1–6 follow the supplied Markdown, slides 7–9 preserve the first PowerPoint's content and diagrams, and slides 10–11 use the updated PowerPoint. The presentation ends with potential applications and questions. The user records the presentation date as November 2026 (`2026-11`), with month precision in the archive.

## Visual system

Apple Design informs native system typography, purposeful whitespace, quiet controls and immediate feedback. `styles.css :root` owns the deck's tokens: canvas #f5f5f7, paper #ffffff, ink #1d1d1f, muted #626269, line #d2d2d7, accent #0071e3, wash #edf5ff. Chart tones are #145c9e, #427eaf, #9db9d0, #dce7ef. Native system display and body type, tabular numerals for counts. Muted text is slightly darker than archive metadata to support explanations. The three original PNG icons and title underline are extracted unchanged into `assets/` and recolored blue through one CSS filter; their geometry is preserved.

## Composition

Use TAG!'s 1280×720 presentation canvas, scaled to the viewport, flat white pages and bottom floating material control bar. Its left group owns Archive / Prev / contents counter / Next; center owns animation time; right owns fullscreen. Chinese notes and the PDF remain file deliverables; the toolbar has no notes, PDF, replay or play/pause buttons. On phones the same canvas remains intact for diagrams and the simplified toolbar stays on one row. Type roles: 61px cover, 42–58px headings, 20–28px body, 18px dense results, 12–15px utilities. Signature: 82–112px emoji sit in independent decorative layers in the whitespace beside relevant examples. Chat and camera float above the research questions; sports and machine motifs sit beside their text with slight static rotations and one short physical gesture. They are aria-hidden because the adjacent text carries the meaning. Decorations never cover titles, body copy or data charts. No repeated card surfaces.

## Behavior

Reuse the archive return destination and shared `../deck-transition.css`. Independent buildless deck, like TAG!, with Back/Forward-aware slide hashes, Home/End and arrow navigation. Critically damped .36s spring transitions carry their current position and velocity on interruption; input remains available. The pure time-based emoji/icon animation runs once for 2.4 seconds and returns to rest. Animations play once on slide entry; range seeking pauses the timeline at the chosen time. Static slides disable the range. Reduced motion renders rest poses and disables illustrative playback. The native contents dialog supports Escape dismissal and focus restoration. Chinese notes are retained in Markdown. Fullscreen denial leaves controls usable. No storage, remote fonts or runtime network dependency. PDF exports remain available as files. Reduced transparency removes blur; high contrast strengthens boundaries. No gesture-only actions.

## Content contract

`content.js` owns current slide markup and Chinese notes. Paper references and explanatory footer caveats are kept in the notes, not projected at the bottom of slides 2–11. The cover retains its paper metadata and uses “Presented by Smart Chen & Xinyue Xia”; `slide-content.md` preserves the user's manuscript and source mapping. The export script generates the current 11-page `speaker-notes.md`. Slides 7–9 retain all source labels/counts, the five-step screening diagram (lengths not to scale), three proportional stacked bars, 23 quality dots (8 filled, 15 outlined), and five evidence-grade rows. Slide 10 dedicates the page to all five comparisons and XR labels from the updated PPT. Slide 11 places Strengths / Limitations in two columns above the two potential applications and Questions. Its updated limitation counts and methodological-quality wording follow the latest supplied PPT; notes distinguish a zero on a methodological item from a zero overall score and retain the expert-model quality caveat. XR content is proposed, not paper evidence. Study quality and evidence strength are distinct. Slide 11 preserves sports and manufacturing application contexts, omitting only a hidden corrupted text fragment. All original visible icons are preserved; sports emoji are additional examples.

## Validation and exports

`scripts/verify_feedback_learning.cjs` exercises all 11 slide bounds, original icon loads, chart and table data, finite deterministic animation, keyboard, history, dialogs, focus restoration, fullscreen denial, mobile touch, narrow layout and reduced motion. `scripts/verify_archive.cjs` covers archive integration. `scripts/export_feedback_learning.cjs` creates the PDF, three real-slide thumbnails and current notes in this deck directory, plus private screenshots and an offline review HTML in ignored `artifacts/feedback-learning/`. No reference PowerPoint is published.
