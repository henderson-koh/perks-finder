# Perks Finder — Project Context & Build Guide

## What This App Is

A mobile-first PWA that lets an Australian user search and browse personal discount benefits across **13 programs**:

| ID | Display Name |
|---|---|
| `rewardgateway` | Work RewardGateway |
| `nrma` | NRMA |
| `bupa` | Bupa |
| `qantas_shopping` | Qantas Shopping Portal |
| `qantas_money` | Qantas FF Card (Qantas Money) |
| `bankwest` | Bankwest CC (More Rewards) |
| `westpac_altitude` | Westpac Altitude Qantas Black |
| `commbank_yello` | CommBank CC (Yello) |
| `everyday_rewards` | Everyday Rewards |
| `shopback` | ShopBack |
| `jbhifi_perks` | JB Hi-Fi Perks |
| `velocity_ff` | Velocity FF |
| `velocity_shopping` | Velocity Shopping Portal |

Single-page app — `index.html` only. No backend, no database, no auth. All personal data lives in `localStorage` on the user's device and is never transmitted anywhere except Claude API calls for AI import (Phase 4) and future chat (v2).

Target device: Android (Samsung S26+) via Chrome "Add to Home Screen" PWA install.

---

## Architecture Decisions (Final — Do Not Revisit)

| Decision | Choice | Reason |
|---|---|---|
| Framework | None — plain HTML/CSS/JS | No build step, no dependencies to maintain |
| Fuzzy search | Fuse.js, bundled inline | Not a UI framework — a utility library. Inline = no CDN security risk |
| CDN imports | Forbidden | Security decision. All libraries bundled inline in index.html |
| Hosting | GitHub Pages (public repo) | Free, simple, no backend needed |
| Sensitive data | localStorage only | API key and benefits data never in code or repo |
| Anthropic API key | User enters once via Settings screen, stored in localStorage | Never hardcoded |
| Tests | `test.js`, run via `node test.js` | No test framework, no build tooling. `localStorage` and DOM mocked inline |
| CSS | System fonts, mobile-first, dark-mode friendly, 390px viewport | No CSS framework |

---

## localStorage Schema

### `perks_data`
```json
{
  "version": 1,
  "programs": {
    "rewardgateway":    { "id": "rewardgateway",    "name": "Work RewardGateway",            "merchants": [] },
    "nrma":             { "id": "nrma",             "name": "NRMA",                          "merchants": [] },
    "bupa":             { "id": "bupa",             "name": "Bupa",                          "merchants": [] },
    "qantas_shopping":  { "id": "qantas_shopping",  "name": "Qantas Shopping Portal",        "merchants": [] },
    "qantas_money":     { "id": "qantas_money",     "name": "Qantas FF Card (Qantas Money)", "merchants": [] },
    "bankwest":         { "id": "bankwest",          "name": "Bankwest CC (More Rewards)",    "merchants": [] },
    "westpac_altitude": { "id": "westpac_altitude",  "name": "Westpac Altitude Qantas Black", "merchants": [] },
    "commbank_yello":   { "id": "commbank_yello",   "name": "CommBank CC (Yello)",           "merchants": [] },
    "everyday_rewards": { "id": "everyday_rewards",  "name": "Everyday Rewards",              "merchants": [] },
    "shopback":         { "id": "shopback",          "name": "ShopBack",                      "merchants": [] },
    "jbhifi_perks":     { "id": "jbhifi_perks",     "name": "JB Hi-Fi Perks",                "merchants": [] },
    "velocity_ff":      { "id": "velocity_ff",      "name": "Velocity FF",                   "merchants": [] },
    "velocity_shopping":{ "id": "velocity_shopping", "name": "Velocity Shopping Portal",      "merchants": [] }
  }
}
```

### Merchant object
```json
{
  "id": "string (slug, e.g. jb-hi-fi-rewardgateway)",
  "name": "string (display name, e.g. JB Hi-Fi)",
  "program": "string (program id)",
  "category": "string (e.g. Electronics, Travel, Health)",
  "discount": "string (verbose — e.g. '5% off all purchases instore and online')",
  "description": "string (verbose, LLM-friendly — e.g. 'JB Hi-Fi is Australia's largest consumer electronics retailer. Members receive 5% off all in-store and online purchases including TVs, laptops, and appliances.')",
  "deepLink": "string (URL to the benefit page, may be empty string)",
  "addedAt": "ISO 8601 timestamp"
}
```

> **LLM-friendliness rule:** `description` fields must be verbose and human-readable. Write them as if explaining to someone who has never heard of the merchant. This enables v2 chat to work well without embeddings.

### `perks_api_key`
Plain string. Anthropic API key entered by user.

---

## v2 Compatibility Notes

v2 will add a Claude-powered chat interface. The user can ask questions like "I want to buy an iPad, what perks do I have?" The full benefits JSON from localStorage is sent as context in a single API call — no vector DB or embeddings.

**v2 requirements must NOT influence Phase 1–5 decisions**, but avoid choices that conflict with it:
- Keep merchant `description` fields verbose (already required above)
- The single `index.html` structure will likely need refactoring into multiple JS modules before v2 — note this in the Phase 5 retro
- Do not add unnecessary state complexity that would make the data shape hard to pass as JSON context

---

## Phases

### Phase 1 — Project Scaffold + Data Layer
- [ ] Folder structure created (`/docs`)
- [ ] `localStorage` schema defined (above)
- [ ] Pre-seed function: populates localStorage with 5 illustrative placeholder merchants for each of the 13 programs (65 total) if `perks_data` is absent. Accuracy not required — will be replaced via AI import. Descriptions must be verbose and LLM-friendly.
- [ ] Export function: downloads full `perks_data` as JSON file
- [ ] Import function: uploads JSON file, merges into localStorage
- [ ] `test.js` unit tests: schema validation, pre-seed, export, import, data merge logic. localStorage mocked inline.
- **No UI yet — data layer only**

### Phase 2 — App Shell + PWA Setup
- [ ] `index.html` with bottom nav (Search / Browse / Manage)
- [ ] PWA manifest (`manifest.json`) and service worker (`sw.js`) — offline capable
- [ ] Settings screen: enter / save / clear Anthropic API key
- [ ] Dark-mode friendly, mobile-first, large tap targets, system fonts, 390px viewport optimised
- [ ] Deploy instructions for GitHub Pages (user enables Pages in repo settings)
- [ ] `test.js` tests: PWA manifest validity, service worker registration, settings persistence

### Phase 3 — Search + Browse
- [ ] Fuzzy search screen: auto-focus input, real-time results showing program name, discount description, deep link. Fuse.js bundled inline.
- [ ] Browse screen: category grid → tap category → filtered merchant list
- [ ] `test.js` tests: fuzzy search accuracy, category filtering, empty states, deep link format

### Phase 4 — AI Import
- [ ] Manage screen: view/edit raw JSON, "Import with AI" button
- [ ] Modal: select which program to import into
- [ ] User pastes raw text from benefits portal → app calls `claude-sonnet-4-6` → extracted merchants preview → merge on confirm
- [ ] `test.js` tests: API call structure, response parsing, merge logic, error states

### Phase 5 — Polish + Install Guide
- [ ] Loading states, error handling, empty states throughout
- [ ] "Add to Home Screen" guide for Android Chrome
- [ ] JSON backup reminder prompt (after 10+ merchants added)
- [ ] Final end-to-end test across all phases
- [ ] Note in retro: `index.html` will need JS module refactor before v2

---

## Working Rules

### Workflow
- Build one phase at a time. Never implement the next step without explicit approval.
- No new dependencies without asking first and explaining why.
- Use existing patterns in the codebase before inventing new ones.
- If there is a significant design decision or structural change, ask before proceeding.

### Testing
- Write tests alongside each feature as it is built — not at the end.
- After each implementation step is approved, add or update tests before moving to the next step.
- Tests must cover: happy path, edge cases, and error/failure cases.
- Before marking any step complete, confirm all existing tests still pass (regression check).
- Never remove or weaken an existing test to make a new one pass — fix the code instead.

### On Bugs
- Never patch bugs silently. Explain what broke and why before fixing.
- Flag if a fix touches more than the file we were working in.

### Progress Tracking
- Maintain a `## Progress` section at the bottom of this file listing each completed phase, date completed, and key decisions made.

### End of Session
- When told "wrap up": write a retro entry to `docs/retro-notes.md` including what was built, what worked, what was tricky, and what to watch out for next session.
- Update `## Progress` section if anything significant was built.
- Confirm what's committed and what's still in progress.

---

## File Structure (Target)

```
perks-finder/
├── index.html          # Everything: all JS, CSS, Fuse.js bundled inline
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── test.js             # All unit tests, run via: node test.js
├── CLAUDE.md           # This file
└── docs/
    └── retro-notes.md  # End-of-session retro entries
```

---

## Implementation Notes for Claude

The test file should mock `localStorage` like this:
```js
const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
```

The Fuse.js library must be copied from its npm package source and pasted inline in `index.html` — do not use a CDN `<script src>` tag.

The Claude API model for AI import (Phase 4) is `claude-sonnet-4-6`.

---

## Progress

### Phase 4 — 2026-05-30
- **Completed:** AI Import modal (program select + paste → Extract with AI → preview → Confirm & Merge), Export Backup, Import Backup, `buildImportPayload` + `parseExtractedMerchants` in data.js, SW cache bumped to `perks-v2` (SW staleness hotfix), 16 new tests (91 total)
- **Key decisions:**
  - `buildImportPayload` and `parseExtractedMerchants` are pure functions in `data.js` (not the app script) so the full AI pipeline is testable in Node.js without mocking `fetch`.
  - `parseExtractedMerchants` stamps `addedAt` and forces `program` itself (via `Object.assign`) — does not trust Claude to supply them correctly.
  - Direct browser API call using `anthropic-dangerous-direct-browser-calls: true` header — no backend proxy needed, app stays fully static.
  - Bottom-sheet modal (slides up from bottom) matches Android native UX on the target device.
  - SW cache name bumped `perks-v1` → `perks-v2` to force browsers to re-fetch updated `data.js` after Phase 3 deploy.

### Phase 3 — 2026-05-30
- **Completed:** Fuzzy search (Fuse.js v7.3.0 inline), category browse with drill-down, deep link navigation, 3 new data.js helpers, 14 new tests (75 total)
- **Key decisions:**
  - Fuse.js v7.3.0 ships CJS-only (no UMD). Wrapped in IIFE `var Fuse = (function(){ var module={exports:{}}; [source]; return module.exports; })();` to expose as browser global.
  - `generate-index.js` utility writes `index.html` by splicing the Fuse source in at build time — keeps diffs readable and avoids manually maintaining 24KB of minified JS in-place.
  - Search index built lazily on first keystroke. Set `fuseInstance = null` to invalidate after Phase 4 imports.
  - Browse drill-down uses show/hide of two sub-divs within the same screen — keeps nav state clean, avoids a fourth tab.
  - Event delegation for cat cards and result items (no inline onclick) — avoids XSS risks from user-controlled data in handler attributes.

### Phase 2 — 2026-05-30
- **Completed:** `index.html` (app shell + 3-screen nav + settings UI), `manifest.json`, `sw.js`, `icons/icon.svg`, `icons/icon-192.png`, `icons/icon-512.png`, `create-icons.js` (utility to regenerate icons)
- **Key decisions:**
  - `index.html` uses `<script src="data.js">` rather than fully inlining data.js — avoids maintaining two copies; all files are cached by the service worker so offline still works. Can be inlined in Phase 5 if needed.
  - PNG icons generated via `create-icons.js` (Node.js core only, no dependencies) — produces solid #4f7eff fills. Can be replaced with a proper branded icon in Phase 5.
  - `loadApiKey`/`saveApiKey`/`clearApiKey` added to `data.js` (not just HTML) to keep them testable
  - SW uses cache-first strategy; core assets (index.html, data.js, manifest.json) are required in the install cache; icons are best-effort (Promise.allSettled)
  - Browse screen in Phase 2 shows a read-only program list with merchant counts — useful immediately, won't conflict with Phase 3 category filtering

### Phase 1 — 2026-05-30
- **Completed:** `data.js` (schema, pre-seed, export, import, merge), `test.js` (40 tests, all passing), `docs/` folder created
- **Key decisions:**
  - `data.js` is a standalone module (browser + Node.js compatible via `module.exports` guard) — will be inlined into `index.html` in Phase 2
  - Seed data: 65 merchants (5 × 13 programs), verbose LLM-friendly descriptions, fixed `addedAt` timestamps for test determinism
  - Merge strategy: incoming overwrites existing by merchant `id`; programs absent from import are left untouched
  - `downloadExport` is browser-only (guarded with `typeof document === 'undefined'` check); `getExportJson` is testable in Node.js
