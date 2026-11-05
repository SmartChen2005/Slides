# Feedback & Motor Skill Learning

## Intent

An explained research presentation for classmates learning motor skill feedback. The first four sections, slides 2–9, teach concepts before reporting evidence. English projection with Chinese preparation notes. No unsupported presentation date is assigned.

## Visual system

Apple Design informs native system typography, purposeful whitespace, quiet controls and immediate feedback. `styles.css :root` owns the deck's tokens: table #f5f5f7, sheet #ffffff, ink #1d1d1f, muted #626269, line #d2d2d7, accent #0071e3, explanatory tint #edf5ff. Muted text is slightly darker than archive metadata to support long explanations. System display and body type, tabular numerals for counts. Typography carries the argument; no illustrative decoration or fabricated imagery.

## Composition

Fixed 1440×810 stage on desktop, scaled to viewport. Flat 16:9 white pages, no card grid. Quotations are the signature device: one teacher cue makes provider, format and content visible. Two- and three-column comparisons encode actual conceptual distinctions. On phones, the active slide becomes a naturally scrolling document with accessible controls.

## Behavior

Reuse the archive return destination and shared `../deck-transition.css`. Independent buildless deck, like siblings, with Back/Forward-aware slide hashes, Home/End and arrow navigation. Native modal dialogs provide Chinese notes and contents, Escape dismissal and focus restoration. Fullscreen denial leaves controls usable. No storage, remote fonts or runtime network dependency. Native PDF download. Reduced motion skips transitions, reduced transparency removes blur, high contrast strengthens boundaries. No gesture-only actions.

## Content contract

`build.py` is the source of slide content and Chinese notes. It generates `index.html` from `template.html` and `speaker-notes.md`. Paper claims cite sections; illustrations are explicitly labeled. XR content is proposed, not paper evidence. Study quality and evidence strength are distinct. Do not repeat the paper's inconsistent expert-model high-quality count.

## Validation and exports

`scripts/verify_feedback_learning.cjs` exercises slide bounds, keyboard, history, dialogs, narrow layout, reduced motion and archive integration. `scripts/export_feedback_learning.cjs` creates PDF and real slide thumbnails in this deck directory. Screenshots and static-audit evidence remain in ignored `artifacts/feedback-learning/`.
