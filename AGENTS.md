# Repository workflow

## Automatic GitHub updates

The user has explicitly requested automatic GitHub updates for this project.
After completing each requested presentation or website update:

1. Validate the affected behavior and run the repository's relevant checks.
2. Regenerate changed presentation exports and archive metadata as needed.
   Keep presentation source and public assets in their deck directory.
3. Review the diff, fetch `origin`, and commit the completed project changes.
4. Push to `origin/main` so the GitHub Pages workflow deploys the update.
   Routine commits, pushes, and Pages deployments are already authorized;
   do not ask for confirmation again for each update.
5. Check the deployment result and report the commit and live presentation URL.
   If a push or deployment fails, report that accurately and fix failures within
   the authorized scope. Do not claim deployment succeeded without evidence.

Use a normal fast-forward push. Never force-push, overwrite remote work, commit
secrets, or include unrelated working-tree changes. If the user explicitly asks
to keep a change local, uncommitted, on another branch, or unpublished, follow
that instruction for the task.

## Project and deployment

- Repository: `https://github.com/SmartChen2005/Slides`
- Deployment branch: `main`
- GitHub Actions workflow: `.github/workflows/pages.yml`
- Public archive: `https://slides.vegshark.com/`
- VR Graffiti presentation: `https://slides.vegshark.com/vr-graffiti/`
- Refresh archive metadata with `python scripts/build_archive.py`.
- Run archive checks with `python -m unittest discover -s tests`.
- Build deployment output with `python scripts/build_archive.py --output _site`.
- For VR Graffiti, use `scripts/verify_vr_graffiti.cjs` for browser checks and
  `scripts/export_vr_graffiti.cjs` when presentation exports need updating.
  These scripts use Playwright from the configured runtime on `NODE_PATH`.
- `_site/` and `artifacts/` are generated, ignored directories. Do not force-add
  them. Pages serves the actual deck directories, not the offline HTML in
  `artifacts/`. Keep already tracked public deliverables current when relevant.
- Preserve the existing custom domain and unrelated presentation routes.
