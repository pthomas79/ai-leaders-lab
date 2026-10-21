# Health check: AI Leaders Lab (2026-10-21)

Docs-only report and an access test. Nothing in the site changed. Do not merge without Paris's OK.

Checked: repo `pthomas79/ai-leaders-lab` @ `main` = `ae06bff` ("Align copy with conversation + refine flow", 24 Mar 2026). Live site: https://ai-leaders-lab.vercel.app/

## 1. Build

- The repo is **plain static HTML with no build step**. It has 5 files: `index.html`, `styles.css`, `script.js`, `prompts.js`, `CLAUDE.md`. There is **no `package.json`**. `CLAUDE.md` confirms "There is no build step… plain HTML file using alpine.js from a CDN".
- I cloned the repo into a remote sandbox (Node v20.20.2, npm 10.8.2) and ran all four commands:
  - `npm ci`: fails, because there is no lockfile or package.json
  - `npm install`: `ENOENT: Could not read package.json`
  - `npm run build`: exit 254, `ENOENT … package.json`
  - `npm run vercel-build`: exit 254, same error
- **Output folder:** none. Vercel serves the repo root as-is (`index.html` plus assets).
- Bottom line: `npm run build` / `vercel-build` don't exist, so any note that says to use them is out of date. Vercel deploys still work (see below).

## 2. Vercel

- Project `ai-leaders-lab` (`prj_4MtwdC2ErFY5yQoYDqcmZZ4uG0pa`), team `paris-projects-92a64a20`.
- The API returned only **3 deployments**, all production builds from `main` via git, all **READY / PROMOTED**, and **no ERROR states**:
  - `dpl_3Gb1LYHChe5ThYFJegXbnUXoEMdq`: commit `ae06bff` (current production), 24 Mar 2026
  - `dpl_C4BbCLxwh5kfxhFVaevTrgsgLetB`: commit `755c3d5`
  - `dpl_EiEaKrAvfcHiL1pHSr6iCsVAzJ7y`: commit `071a01b`
- **Production commit = latest `main` commit (`ae06bff`).** Nothing is waiting to deploy.
- Live check: HTTP 200, `server: Vercel`, `x-vercel-cache: HIT`, and the 14,127-byte HTML matches `index.html` in the repo.

## 3. Live site test (headless Chromium, 1440px desktop and 390px mobile)

The site is a single page with no `<a href>` links and no other pages. I tested all six output types end to end (Step 1 → 2 → 3, copy buttons, the progress-bar nav back to step 1, and the success screen), then reloaded.

What worked: no console errors, no page errors, no failed requests or 4xx/5xx responses. The one image (Nestlé logo) loaded. There was no horizontal overflow at 390px. "Continue" stays disabled until a card is picked. Every prompt box filled in, and each copy button put the full prompt on the clipboard.

Issues, by severity:

| # | Severity | Issue |
|---|---|---|
| 1 | **High (for a venue)** | **Blank page if the Alpine.js CDN can't load.** The whole app sits in `<div x-data x-cloak>`, and `[x-cloak]{display:none}` stays on until Alpine runs. With `cdn.jsdelivr.net` blocked, the page rendered completely empty (root height 0). Corporate firewalls or weak venue Wi-Fi could cause this. |
| 2 | **Medium (bug)** | **The specialist-agent warning never shows.** The `.agent-warning` box has `x-show="isAgent"`, but `styles.css` sets `.agent-warning { display:none }`, which beats Alpine. So the Researcher/Analyst steps say "check the disclaimer below", and no disclaimer appears. That disclaimer covers IT enablement and the 25-query monthly limit. Fix: drop `display:none` from the CSS rule. |
| 3 | Medium (content) | Old client content is still in place: the Nestlé logo and name in the header, the hero line "March 25, 2026 · Rive Reine", "Implications for Nestlé" in the Researcher prompt, and CSS variables named `--nestle-red`. |
| 4 | Low | The floating version `alpinejs@3.x.x` resolved to 3.17.5 today. A future Alpine release could change behaviour with no change to the repo. |
| 5 | Low | Progress isn't saved: a reload goes back to Step 1 with the choice lost. The success screen has no "start over" or "try another output" button. |
| 6 | Low (visual) | On desktop and mobile, the "Copy" button overlaps the first line of the prompt text. Step 2 says "replace the highlighted parts", but the `[placeholders]` aren't highlighted. |
| 7 | Low (mobile) | Progress circles are 28×28px tap targets (under the 44px guideline). Step labels are hidden at 390px. |
| 8 | Low | Outside dependencies: Google Fonts (Inter) and a logo hotlinked from Wikimedia. The page still works if these are blocked: it uses fallback fonts and the text logo shows. |

## 4. How the site is built

- `index.html`: the page layout plus most of the text, hard-coded (header, hero, instructions for steps 2–4, refine questions, tips, bonus prompts, success checklist).
- `script.js`: one Alpine component, `lab()`. It holds the step state (`step`, `maxStep`, `selectedType`), the 6 output cards (title, description, inline SVG icon), agent detection (`researcher`/`analyst`), `goTo()`, and copy-to-clipboard.
- `prompts.js`: two global objects, `contextPrompts` and `generatePrompts`, keyed by output type. These are the only parts that already work like content data.
- `styles.css`: a single stylesheet with CSS variables. The brand colour is `--nestle-red: #E2001A`, and there's a breakpoint at 640px.
- **How tied it is to the current audience:** high. "Copilot" / "Microsoft Copilot" / Teams / M365 appear throughout the HTML and the prompts. The client name, logo, date and venue are written directly into the HTML. Both the CSS colour names and the card icons' `stroke="#E2001A"` carry the brand.
- **How hard a client variant would be:** easy. There's no build, no framework, no backend, about 34 KB in total. You could copy it and find-and-replace in under an hour. To support repeat clients properly, move all text and branding into one `config.js` (or JSON) per client. That's about half a day.

## 5. Ranked suggestions for a BSM (ship management, India) version

| Rank | Idea | Impact | Effort |
|---|---|---|---|
| 1 | **Fix first:** self-host Alpine (pin a version and commit `alpine.min.js`), and fix the hidden agent warning (issue #2). Without the first fix, a blocked CDN means a blank page in the room. | High | ~30 min |
| 2 | **One config file per client:** move the client name, logo, colours, date/venue, card list, all prompts and step text into `clients/bsm.js`, then load it via `?client=bsm` or one Vercel project/branch per client. Remove every Nestlé reference. | High | ½ day |
| 3 | **Maritime examples and prompts:** rewrite the placeholders and example challenges for ship management. Examples: vessel performance or off-hire analysis, a crew-change or manning comms note, a PSC/vetting inspection readiness brief, a dry-dock or OPEX budget deck, a regulatory scan (IMO/CII/EU ETS) for the Researcher card. Use sample anonymised CSVs (noon reports, budget vs actual) for the Analyst card. | High | ½–1 day (with Paris's content input) |
| 4 | **Low-bandwidth / offline resilience:** self-host the Inter font (or use system fonts) and the logo, and add a small service worker / PWA manifest so the page works after first load even if venue Wi-Fi drops. Offer a printable one-page PDF of the prompts as a backup. | Med–High | ½ day |
| 5 | **Facilitator mode and progress:** save progress in `localStorage`, add a "start over / try another output" button, and add a `?facilitator=1` view with timings, talking points and a QR code to the participant URL. Optionally add a language/tone switch and check the prompts suit Indian English. | Medium | ½–1 day |

Also worth doing: bigger mobile tap targets on the progress steps, highlighting `[placeholders]` in the prompt boxes, and confirming which Copilot licence and agents BSM actually has (the Researcher/Analyst cards depend on it).

Screenshots were taken locally during the check and aren't committed.
