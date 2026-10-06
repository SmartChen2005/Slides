#!/usr/bin/env python3
"""Discover static decks and build their archive. Python standard library only."""
import argparse
from datetime import date
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {".git", ".github", "node_modules", "scripts", "tests", "_site", "artifacts", "__pycache__", "premium-audit.json"}
CATEGORIES = {"DESIGN", "FILM", "TECH", "RESEARCH", "UNCATEGORIZED"}


class DeckParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.slide_count = 0
        self.in_title = False
        self.title = []
        self.description = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "slide" in attrs.get("class", "").split():
            self.slide_count += 1
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content", "")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)


def asset_path(folder, value, root):
    """Metadata assets are local files relative to the deck, never remote URLs."""
    if not isinstance(value, str):
        raise ValueError(f"{folder}: asset paths must be strings")
    candidate = (folder / value).resolve()
    if not candidate.is_relative_to(root.resolve()) or not candidate.is_file():
        raise ValueError(f"{folder}: missing or out-of-site asset {value!r}")
    return "./" + quote(candidate.relative_to(root.resolve()).as_posix(), safe="/")


def discover(root):
    decks = []
    for page in sorted(root.rglob("index.html")):
        relative = page.relative_to(root)
        if page.parent == root or any(part.startswith(".") or part in EXCLUDED for part in relative.parts):
            continue
        parser = DeckParser()
        parser.feed(page.read_text(encoding="utf-8"))
        metadata_path = page.with_name("deck.json")
        if not metadata_path.exists() and not parser.slide_count:
            continue
        metadata = json.loads(metadata_path.read_text(encoding="utf-8")) if metadata_path.exists() else {}
        if not isinstance(metadata, dict):
            raise ValueError(f"{metadata_path}: expected a JSON object")
        title = metadata.get("title") or "".join(parser.title).split("|")[0].strip() or page.parent.name.replace("-", " ").title()
        recorded_date = metadata.get("date")
        if recorded_date is not None:
            if not isinstance(recorded_date, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", recorded_date):
                raise ValueError(f"{metadata_path}: date must use YYYY-MM-DD")
            date.fromisoformat(recorded_date)
        category = str(metadata.get("category", "UNCATEGORIZED")).upper()
        if category not in CATEGORIES:
            raise ValueError(f"{metadata_path}: category must be one of {sorted(CATEGORIES)}")
        slide_count = parser.slide_count or metadata.get("slideCount")
        if not isinstance(slide_count, int) or isinstance(slide_count, bool) or slide_count < 1:
            raise ValueError(f"{page}: use class='slide' on slides or record a positive slideCount in deck.json")
        thumbnails = metadata.get("thumbnails")
        if thumbnails is None:
            thumbnails = [str(p.relative_to(page.parent)) for p in sorted((page.parent / "thumbnails").glob("*")) if p.suffix.lower() in {".webp", ".png", ".jpg", ".jpeg"}][:3]
        if not isinstance(thumbnails, list):
            raise ValueError(f"{metadata_path}: thumbnails must be a list")
        deck = {
            "title": str(title),
            "path": "./" + quote(page.parent.relative_to(root).as_posix(), safe="/") + "/",
            "date": recorded_date,
            "category": category,
            "slideCount": slide_count,
            "description": str(metadata.get("description", parser.description)),
            "thumbnails": [asset_path(page.parent, value, root) for value in thumbnails[:3]],
        }
        if metadata.get("cover"):
            deck["cover"] = asset_path(page.parent, metadata["cover"], root)
        decks.append(deck)
        if not recorded_date:
            print(f"Note: {relative.parent} has no recorded date; listed as Undated.")
    return sorted(decks, key=lambda deck: (deck["date"] or "", deck["title"].lower()), reverse=True)


def build(root, output=None):
    decks = discover(root)
    destination = output or root
    if output:
        destination = output if output.is_absolute() else root / output
        # Only this known generated directory may be rebuilt. Never recursively
        # remove a computed arbitrary output path or an existing deck directory.
        expected = root.resolve() / "_site"
        if destination.resolve() != expected or destination.is_symlink():
            raise ValueError("--output must be the site's generated _site directory")
        if destination.exists():
            shutil.rmtree(destination)
        destination.mkdir(parents=True, exist_ok=True)
        for source in root.iterdir():
            if source.name.startswith(".") or source.name in EXCLUDED or source.resolve() == destination.resolve() or source.suffix == ".md":
                continue
            target = destination / source.name
            if source.is_dir():
                shutil.copytree(source, target, dirs_exist_ok=True, ignore=shutil.ignore_patterns("__pycache__", ".git"))
            else:
                shutil.copy2(source, target)
    payload = json.dumps(decks, ensure_ascii=True, indent=2)
    (destination / "archive-data.js").write_text("// Generated by scripts/build_archive.py. Edit each deck's deck.json instead.\nwindow.SLIDE_ARCHIVE = " + payload + ";\n", encoding="utf-8")
    (destination / ".nojekyll").touch()
    print(f"Built {len(decks)} presentations / {sum(deck['slideCount'] for deck in decks)} slides in {destination}")
    return decks


if __name__ == "__main__":
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("--output", type=Path, help="rebuild _site as the complete static site for GitHub Pages")
    options = args.parse_args()
    build(ROOT, options.output)
