---
version: alpha
name: "Smart Chen Slide Archive"
description: "An editorial light table where presentations behave as stacks of slides."
colors:
  table: "#f5f5f7"
  sheet: "#ffffff"
  ink: "#1d1d1f"
  muted: "#6e6e73"
  line: "#d2d2d7"
  accent: "#0071e3"
typography:
  sans:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  notation:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
rounded:
  DEFAULT: "14px"
spacing:
  page-max: "1280px"
  grid-gap: "42px"
components:
  stack: {}
  filter: {}
---

# Slide Archive Design System

## Overview

### Creative North Star

A digital slide sorter or light table, inspired by Tangible Bits: information has spatial behavior. One presentation is one stack of thin rectangular sheets, consistently across the archive. Physicality comes from layering, restrained perspective, shadows, and an opening gesture.

### Product context and register

- Audience: visitors browsing Smart Chen's presentations, research, projects, and experiments.
- Content-site register; English interface, en-US calendar-date display. No country-specific market behavior is implied.
- Usage: mouse and keyboard on desktop; simplified touch browsing on mobile.
- Signature: sheets lift and fan, then move into the center and become the actual presentation stage.
- Restraint: generous whitespace, quiet metadata, functional year labels, a single system-blue accent for navigation and focus.
- Anti-references: SaaS card grids, glossy 3D, fake paper textures, unique physical objects for every deck.
- Runtime token ownership: `archive.css :root` is canonical for the homepage. This file mirrors its exact named palette and font values. Presentation-specific styling remains in each deck. `deck-transition.css` owns shared navigation motion.
- Design dials: DESIGN_VARIANCE 6 / MOTION_INTENSITY 4 / VISUAL_DENSITY 3, following the user's minimal editorial brief.

## Colors

One light theme: table background, white sheets, near-black ink, neutral muted text and hairlines. Blue marks navigation and focus. A raised white segment marks the active filter; the surrounding toolbar uses one restrained translucent material. No dark-theme section flips or textures. Forced-colors mode retains visible sheet borders and selected state.

## Typography

One native system family provides platform typography without network requests. The archive heading is sized like an exhibition index rather than a full-width hero. Cover titles dominate, with type sized relative to the sheet's width. Metadata is small, spaced sans-serif with tabular numerals; slide counts use three digits (005 SLIDES). Normal prose stays sentence case. Dates use explicit UTC formatting to preserve the recorded calendar day.

## Layout

Page max 1280px, horizontal gutters from 22px to 64px. A quiet masthead contains only VegShark.com, linking to http://vegshark.com/. The centered intro contains only the sentence-case Slide archive title, without an eyebrow, subtitle, or collection note. The rounded material toolbar sits above the collection. Year labels sit above a generous two-column grid; at 600px decks collapse to one column. Sheets are presentation-native 16:9. Generous space beneath each stack reserves its internal preview fan without moving neighboring content.

## Elevation & Depth

Each deck has up to four underlying sheets, using ceil(log2(slideCount)) layers and a small count-dependent edge offset. The stack is nearly flat at rest: sub-2px increments, 1px edges, slight opacity variation, tiny inter-sheet shadows. Engaged covers lift 5px; lower sheets independently separate in 1.5px horizontal and 2.3px vertical increments, rotating at most 0.48 degrees. Real thumbnail sheets reside behind the cover and slide into an overlapping fan after 220ms of hover. They retract when the cursor leaves. Perspective limits are 1 degree X / 1.5 degrees Y, further damped by distance. Shadows belong to sheets, never to generic page containers.

## Shapes

Sharp rectangular sheets retain the presentation geometry. Rounded 14px filter controls sit inside a 21px translucent toolbar. The Apple-inspired controls frame the existing paper metaphor; slides never become rounded cards. No texture. Decks share one composition regardless of category.

## Components

### Foundational visual states

Native anchors open decks; native buttons filter. Every action has visible focus and pointer feedback. Active filters have a raised white surface and aria-pressed state. Empty categories explain the absence and offer View all presentations. Failed archive loading offers Reload archive. Live status announces filtering and opening.

### Buttons and actions

Filters are minimal text buttons with 44px minimum height. Open deck is visible on every sheet. Opening temporarily marks the link busy and prevents duplicate activation without altering its dimensions. No destructive operations.

### Navigation and data display

Real deck paths remain independent static HTML pages. Filters persist in URL query parameters and restore on Back/Forward. Recorded years group decks newest first, with Undated last. Footer reports full archive totals. Previews are decorative duplicates of the deck; they never hide unique actions or information.

### Forms and overlays

No forms or dialogs or preview popups. Preview sheets are real children of the stack. The temporary cloned cover during opening is aria-hidden, noninteractive, and removed after history restoration. Existing presentation controls remain untouched.

### Iconography

No icon library; the typographic northeast arrow supplements the explicit Open deck label.

### Motion

All material motion uses cubic-bezier(.22,1,.36,1), with no bounce or overshoot. Native transforms animate independent sheets; requestAnimationFrame schedules perspective only on pointer input. On opening, surrounding decks dim, the selected cover lifts, and lower layers gather for 160ms (100ms touch). A 620ms cover animation (380ms touch) translates into the center first, then expands to the actual presentation stage before navigation. Cross-document View Transitions connect the cover to the live slide with a short 240ms content handoff; the page itself does not fade. No continuous loops or scroll hijacking. Reduced motion uses immediate native navigation; toggling it during opening cancels the remaining animation. Back restores sheet visibility and interaction state.

### Content and data visualization

Only repository content is shown. No fabricated presentations, dates, thumbnails, or counts. Date fields belong beside the deck in deck.json, with ISO calendar dates or YYYY-MM when only the month is known. Same-date order values record chronology without inventing a day; larger values appear first. Both October 2026 decks use month precision, with VR Graffiti later than Ensemble Mutual. Undated is an honest missing-data state. Actual screenshots provide previews.

## Do's and Don'ts

- Do keep every deck in the same stack system and preserve the slide page's own content.
- Do document and explicitly record presentation dates rather than infer them from file edits.
- Don't fabricate extra decks to fill the grid.
- Don't add texture, glossy rendering, ambient motion, or hidden hover-only navigation.

## October 2026 homepage refresh

The user requested Apple design styling while preserving the slide stack expansion mechanism. The system palette, optical typography, toolbar material, spacing, and cover elevation changed; preview timing, perspective, lower-sheet transforms, opening animation, navigation, and history restoration remain the established implementation. Reduced transparency removes toolbar blur, increased contrast strengthens boundaries, and reduced motion preserves native navigation. Deck-specific visual systems and exports are unchanged.
