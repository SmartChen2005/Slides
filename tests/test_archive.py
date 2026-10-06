"""Test discovery, recorded dates, safe assets, and static-site staging."""
import json
from pathlib import Path
import tempfile
import unittest
from scripts.build_archive import build, discover


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def deck(self, name, metadata=None):
        folder = self.root / name
        folder.mkdir(parents=True)
        (folder / "index.html").write_text('<title>Discovered title | Talk</title><section class="slide active"></section><section class="slide"></section>', encoding="utf-8")
        if metadata is not None:
            (folder / "deck.json").write_text(json.dumps(metadata), encoding="utf-8")
        return folder

    def test_discovers_slides_and_preserves_explicit_date(self):
        self.deck("talk", {"date": "2026-10-06", "category": "TECH"})
        (self.root / "index.html").write_text('<section class="slide"></section>', encoding="utf-8")
        deck, = discover(self.root)
        self.assertEqual((deck["title"], deck["slideCount"], deck["date"], deck["path"]), ("Discovered title", 2, "2026-10-06", "./talk/"))

    def test_missing_date_is_not_inferred_and_sorts_last(self):
        self.deck("undated")
        self.deck("dated", {"date": "2025-12-31"})
        decks = discover(self.root)
        self.assertEqual([deck["date"] for deck in decks], ["2025-12-31", None])

    def test_rejects_ambiguous_and_impossible_dates(self):
        folder = self.deck("talk")
        for value in ["10/6/2026", "2026-02-30", "2026-1-06"]:
            with self.subTest(date=value):
                (folder / "deck.json").write_text(json.dumps({"date": value}), encoding="utf-8")
                with self.assertRaises(ValueError):
                    discover(self.root)

    def test_auto_thumbnails_and_encoded_routes(self):
        folder = self.deck("a talk")
        (folder / "thumbnails").mkdir()
        (folder / "thumbnails" / "01.webp").write_bytes(b"image")
        deck, = discover(self.root)
        self.assertEqual(deck["path"], "./a%20talk/")
        self.assertEqual(deck["thumbnails"], ["./a%20talk/thumbnails/01.webp"])

    def test_rejects_missing_assets(self):
        self.deck("talk", {"thumbnails": ["missing.png"]})
        with self.assertRaises(ValueError):
            discover(self.root)

    def test_other_presentation_formats_can_record_slide_count(self):
        folder = self.deck("other", {"slideCount": 12})
        (folder / "index.html").write_text('<title>Other</title>', encoding="utf-8")
        self.assertEqual(discover(self.root)[0]["slideCount"], 12)

    def test_staging_preserves_deck_and_domain_and_excludes_tooling(self):
        folder = self.deck("talk", {"date": "2026-10-06"})
        (self.root / "CNAME").write_text("slides.vegshark.com", encoding="utf-8")
        (self.root / "scripts").mkdir()
        (self.root / "scripts" / "dev.py").touch()
        staged = self.root / "_site"
        build(self.root, staged)
        self.assertEqual((staged / "talk" / "index.html").read_bytes(), (folder / "index.html").read_bytes())
        self.assertEqual((staged / "CNAME").read_text(), "slides.vegshark.com")
        self.assertFalse((staged / "scripts").exists())
        self.assertTrue((staged / "archive-data.js").exists())
        self.assertTrue((staged / ".nojekyll").exists())
        self.assertEqual(len(discover(self.root)), 1)

    def test_rebuild_removes_only_stale_generated_files(self):
        self.deck("talk")
        output = self.root / "_site"
        build(self.root, output)
        (output / "stale.html").touch()
        build(self.root, output)
        self.assertFalse((output / "stale.html").exists())
        self.assertTrue((self.root / "talk" / "index.html").exists())
        with self.assertRaises(ValueError):
            build(self.root, self.root / "talk")


if __name__ == "__main__":
    unittest.main()
