This is a simple project using plain HTML in combination with alpine.js

## Build & Run

The app source (index.html, styles.css, script.js, prompts.js, vendor/, assets/) has no build step,
but the PUBLIC site is password-gated: only the generated `deploy/` folder is served (see `vercel.json`,
`outputDirectory: "deploy"`, no build command). `tools/encrypt.py` inlines the whole app into one HTML
document, encrypts it (AES-256-GCM, key from PBKDF2-HMAC-SHA256, 200,000 iterations, random 16-byte salt
and 12-byte IV per build) and writes `deploy/index.html`, a small BSM-branded password page that decrypts
in the browser with WebCrypto. Fonts and `sw.js` are copied into `deploy/` as public files.
Nothing is stored in the browser (no localStorage/sessionStorage/cookies); the password is asked on every visit.

**After ANY change to the app source, rebuild and commit `deploy/`:**

```bash
pip install cryptography          # once
python3 tools/encrypt.py          # rewrites deploy/
```

### Changing the password

1. Edit `.env.local` in the repo root (gitignored, never commit it): `SITE_PASSWORD=<new password>`
   (or export `SITE_PASSWORD` in the shell; the env var wins over `.env.local`).
2. `python3 tools/encrypt.py`
3. Commit `deploy/` (only `deploy/index.html` changes) and push.
4. Deploy with Vercel (git auto-deploy is off): create a deployment of the branch on project
   `bsm-ai-leaders-lab` (preview first, then production).

Never put the password in any committed file, commit message, PR text or README.

## Validation

Run these after implementing to get immediate feedback:

This is TBD. Not to set that.

- Tests: `[test command]`
- Typecheck: `[typecheck command]`
- Lint: `[lint command]`

## Operational Notes

Succinct learnings about how to RUN the project:

- No external runtime dependencies: Alpine.js is self-hosted in `vendor/` (pinned 3.17.5), Inter font in `fonts/`, client logo in `assets/`.
- The live service worker is `tools/sw.gate.js` (copied to `deploy/sw.js` by the build). It is network-first and caches ONLY the encrypted gate page and the font, so an offline reload still asks for the password. On activate it deletes every other cache (including old pre-gate `ailab-bsm-v3-*` caches that held plaintext). Bump `VERSION` when changing it. The root `sw.js` is only used for local, ungated development.
- Client branding lives in the `--brand*` CSS variables at the top of `styles.css`, the logo/title/eyebrow in `index.html`, and prompts in `prompts.js`.
- Local test of the app source: `python3 -m http.server` in the repo root. Test the gated build: `python3 tools/encrypt.py && python3 -m http.server -d deploy` (service workers need http://localhost or https).

### Codebase Patterns

...
