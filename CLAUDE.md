This is a simple project using plain HTML in combination with alpine.js

## Build & Run

There is no build step in this project. It's a plain HTML file using alpine.js from a CDN

## Validation

Run these after implementing to get immediate feedback:

This is TBD. Not to set that.

- Tests: `[test command]`
- Typecheck: `[typecheck command]`
- Lint: `[lint command]`

## Operational Notes

Succinct learnings about how to RUN the project:

- No external runtime dependencies: Alpine.js is self-hosted in `vendor/` (pinned 3.17.5), Inter font in `fonts/`, client logo in `assets/`.
- `sw.js` is a network-first service worker (offline fallback for weak venue Wi-Fi). When releasing, bump `VERSION` in `sw.js`; if you add/rename a static file, add it to `PRECACHE`.
- Client branding lives in the `--brand*` CSS variables at the top of `styles.css`, the logo/title/eyebrow in `index.html`, and prompts in `prompts.js`.
- Local test: `python3 -m http.server` in the repo root (service workers need http://localhost or https).

### Codebase Patterns

...
