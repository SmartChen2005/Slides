---
version: alpha
name: "Smart Chen Slide Archive"
description: "An editorial light table where presentations behave as stacks of slides."
colors:
  table: "#f2f3f2"
  sheet: "#ffffff"
  ink: "#181818"
  muted: "#646664"
  line: "#d7d9d7"
  accent: "#d92c21"
typography:
  sans:
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  mono:
    fontFamily: '"Courier New", monospace'
rounded:
  DEFAULT: "0"
spacing:
  page-max: "1920px"
  grid-gap: "36px"
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
- Restraint: generous whitespace, quiet metadata, functional year labels, a single red accent inherited from Ensemble Mutual.
- Anti-references: SaaS card grids, glossy 3D, fake paper textures, unique physical objects for every deck.
- Runtime token ownership: `archive.css :root` is canonical for the homepage. This file mirrors its exact named palette and font values. Presentation-specific styling remains in each deck. `deck-transition.css` owns shared navigation motion.
- Design dials: DESIGN_VARIANCE 6 / MOTION_INTENSITY 4 / VISUAL_DENSITY 3, following the user's minimal editorial brief.

## Colors

One light theme: table background, white sheets, near-black ink, neutral muted text and hairlines. Red marks selected filters, focus, and the opening arrow. No dark-theme section flips or textures. Forced-colors mode retains visible sheet borders and selected state.

## Typography

Helvetica/Arial system fonts inherit the existing presentation's Swiss typography without network font requests. Large tight uppercase archive heading; bold, readable deck titles. Courier New utility metadata conveys dates and slide counts. Normal prose stays sentence case. Dates use explicit UTC formatting to preserve the recorded calendar day.

## Layout

Page max 1920px, horizontal gutters from 22px to 80px. Masthead, large title, subtitle, filter bar, then year groups. The year gutter is 82px on desktop; grid is two columns by default, three at 1240px, four at 1740px. At 900px year labels sit above the grid; at 600px decks collapse to one column. Only real decks occupy cells. Preview space is reserved so hover does not move neighboring content.

## Elevation & Depth

Each deck has at most four underlying sheets based on its actual slide count. Shadows are soft and neutral. Top sheet lifts 7px on hover; lower sheets fan by several pixels. Pointer perspective stays below one degree. Shadows belong to sheets, never to generic page containers.

## Shapes

Sharp rectangular sheets, square controls, thin borders. No pills, texture, or rounded card system. Decks share one composition regardless of category.

## Components

### Foundational visual states

Native anchors open decks; native buttons filter. Every action has visible focus and pointer feedback. Active filters have an underline and aria-pressed state. Empty categories explain the absence and offer View all presentations. Failed archive loading offers Reload archive. Live status announces filtering and opening.

### Buttons and actions

Filters are minimal text buttons with 44px minimum height. Open deck is visible on every sheet. Opening temporarily marks the link busy and prevents duplicate activation without altering its dimensions. No destructive operations.

### Navigation and data display

Real deck paths remain independent static HTML pages. Filters persist in URL query parameters and restore on Back/Forward. Recorded years group decks newest first, with Undated last. Footer reports full archive totals. Previews are decorative duplicates of the deck; they never hide unique actions or information.

### Forms and overlays

No forms or dialogs. The temporary cloned sheet during opening is aria-hidden, noninteractive, and removed after history restoration. Existing presentation controls remain untouched.

### Iconography

No icon library; the typographic northeast arrow supplements the explicit Open deck label.

### Motion

Native CSS transforms for sheet lift/fan; requestAnimationFrame for cursor perspective; Web Animations for the 340ms center pull (220ms touch). Shared cross-document View Transitions take 520ms where supported. No continuous loops or scroll hijacking. Reduced motion disables spatial motion and uses immediate native navigation. Back restores the deck's visibility and interaction state.

### Content and data visualization

Only repository content is shown. No fabricated presentations, dates, thumbnails, or counts. Date fields belong beside the deck in deck.json, with ISO calendar dates. Undated is an honest missing-data state. Actual screenshots provide previews.

## Do's and Don'ts

- Do keep every deck in the same stack system and preserve the slide page's own content.
- Do document and explicitly record presentation dates rather than infer them from file edits.
- Don't fabricate extra decks to fill the grid.
- Don't add texture, glossy rendering, ambient motion, or hidden hover-only navigation.
