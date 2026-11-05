# Smart Chen / Slide Archive

Static HTML, CSS, and JavaScript for **slides.vegshark.com**. The homepage is a light table of presentation stacks. Existing decks keep their own routes and presentation code.

## Add a presentation

1. Put the deck in its own folder, for example `my-new-talk/index.html`.
2. Add a `deck.json` alongside it:

```json
{
  "title": "My new talk",
  "date": "2026-10-06",
  "category": "DESIGN",
  "description": "A short, optional description."
}
```

Use `DESIGN`, `FILM`, `TECH`, or `RESEARCH`. Omitted categories appear as `UNCATEGORIZED` under ALL. The scanner discovers decks with `.slide` elements, derives the title from `<title>` when omitted, and counts slides automatically. For other presentation formats, add `slideCount` to `deck.json`. An ordinary subpage without `.slide` elements or `deck.json` is not treated as a deck.

**Dates are presentation dates**, explicitly recorded as `YYYY-MM-DD`, not creation dates or last-edit dates. Ensemble Mutual is recorded as **October 6, 2026** (`2026-10-06`). Dates render as calendar days without timezone shifts. Missing dates are shown as **Undated**; the build does not invent dates from Git history or filesystem timestamps.

Optionally put up to three actual slide screenshots in a `thumbnails/` folder. Name them `01.webp`, `02.webp`, etc.; they are discovered automatically in filename order. Alternatively, list deck-relative filenames in `thumbnails`. A deck-relative `cover` image is optional and serves as the preview when thumbnails are absent. Keep these assets local to the site. The archive works without images.

To enable the sheet-to-presentation transition on a future deck, link `../deck-transition.css` from its HTML and add `style="view-transition-name: open-deck"` to its main slide stage. For nested folders, adjust the relative stylesheet path. Ordinary navigation works without this enhancement. Reduced motion skips the animation, and modified clicks retain normal new-tab behavior.

## Preview locally

```sh
python scripts/build_archive.py
python -m http.server 8000
```

Open `http://localhost:8000`. The generated `archive-data.js` is checked in so branch-based GitHub Pages publishing and local preview both work. Regenerate it after adding or changing a deck. No browser framework, package install, or web build tool is needed.

## GitHub Pages

The supplied workflow scans decks on every push to `main`, validates their metadata, stages the site, and deploys it. In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** to enable this workflow. Keep the custom domain set to **slides.vegshark.com** in Pages settings; the existing `CNAME` is preserved. If retaining branch publishing instead, run the scanner locally and commit the updated `archive-data.js` with each new deck.

```sh
python -m unittest discover -s tests
python scripts/build_archive.py --output _site
```

`_site/` is the deployment artifact. Tooling, tests, Git internals, and design documentation are excluded. The workflow uses Python's standard library only and never rewrites a presentation page.

## Interaction

- Hover: the cover lifts 5px and thin lower sheets separate independently. After 220ms, real preview sheets fan from beneath the cover and retreat on exit. No separate preview popup.
- Pointer movement: proximity gently lifts the cover and dampens perspective, capped at 1 degree X / 1.5 degrees Y. Sheets settle with controlled easing. Updates are scheduled once per frame and stop on touch or reduced motion.
- Click: surrounding decks dim, the lower sheets gather, and the cover is pulled into the center before expanding to the actual 16:9 presentation stage. Navigation follows the expansion; cross-document View Transitions provide a short shared-sheet content handoff where supported. The whole page does not fade.
- Keyboard: native links/buttons, visible focus, preview visibility on deck focus, and announced filter results.
- Mobile: one column, readable labels, persistent previews, and no cursor perspective.

Category filters persist in the URL, support browser Back/Forward, and provide a reset action for empty categories. Counts always describe the full archive.
