# Perks Finder — Project Context & Build Guide

## What This App Is

A mobile-first PWA that lets an Australian user search and browse personal discount benefits across **10 programs**:

| ID | Display Name |
|---|---|
| `rewardgateway` | Work RewardGateway |
| `nrma` | NRMA |
| `bupa` | Bupa |
| `qantas_shopping` | Qantas Shopping Portal |
| `qantas_money` | Qantas FF Card (Qantas Money) |
| `westpac_altitude` | Westpac Altitude Qantas Black |
| `commbank_yello` | CommBank CC (Yello) |
| `everyday_rewards` | Everyday Rewards |
| `velocity_ff` | Velocity FF |
| `velocity_shopping` | Velocity Shopping Portal |

Single-page app — `index.html` only. No backend, no database, no auth. All personal data lives in `localStorage` on the user's device and is never transmitted anywhere except Claude API calls for AI import (Phase 4).

Target device: Android (Samsung S26+) via Chrome "Add to Home Screen" PWA install.

**Primary use case: search-driven.** The user is standing outside a store and searches the merchant name to see what perks are available across all programs. Browse/category navigation is not a primary use case.

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
| AI import model | `claude-sonnet-4-6` | Do not substitute a different model ID |
| AI import max_tokens | 64000 | Model maximum — do not reduce |

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
    "westpac_altitude": { "id": "westpac_altitude",  "name": "Westpac Altitude Qantas Black", "merchants": [] },
    "commbank_yello":   { "id": "commbank_yello",   "name": "CommBank CC (Yello)",           "merchants": [] },
    "everyday_rewards": { "id": "everyday_rewards",  "name": "Everyday Rewards",              "merchants": [] },
    "velocity_ff":      { "id": "velocity_ff",      "name": "Velocity FF",                   "merchants": [] },
    "velocity_shopping":{ "id": "velocity_shopping", "name": "Velocity Shopping Portal",      "merchants": [] }
  }
}
```

### Merchant object
```json
{
  "id": "string (kebab-case slug of merchant name only, e.g. 'jb-hi-fi', 'woolworths', 'event-cinemas')",
  "name": "string (normalised common trading name, e.g. 'JB Hi-Fi', 'Woolworths', 'Event Cinemas')",
  "program": "string (program id)",
  "category": "string (program-native category, e.g. 'Electronics', 'Travel', 'Health')",
  "discount": "string (verbose, program-prefixed — see per-program prompt rules below)",
  "description": "string (verbatim text from the source portal — do not generate)",
  "deepLink": "string (URL to the benefit page, may be empty string)",
  "addedAt": "ISO 8601 timestamp"
}
```

**Merchant ID rule:** the `id` slug is derived from the merchant name only — never include the program name in the slug. This ensures that "JB Hi-Fi" always generates `jb-hi-fi` regardless of which program it comes from, enabling reliable cross-program deduplication and consistent merge behaviour across multiple paste sessions.

**Merchant name rule:** always normalise to the common trading name. "JB HI-FI Gift Cards" → "JB Hi-Fi". "WOOLWORTHS SUPERMARKET EGIFT CARD" → "Woolworths". This ensures search works correctly when the user types a merchant name.

**Discount field rule:** always prefix with enough context to be self-explanatory. "9%" is ambiguous — "Earn 9% cashback" or "9 Qantas pts per $1" is not.

### `perks_api_key`
Plain string. Anthropic API key entered by user.

---

## Per-Program AI Import Prompt Variants

`buildImportPayload(programId, programName, rawText)` must switch on `programId` and use a tailored extraction prompt. The goal is always extract-only — never generate content that isn't already in the paste.

### `nrma`
Format: merchant name, description blurb, two prices (original strikethrough + discounted).
- Calculate discount % from the two prices: `round((original - discounted) / original * 100)`
- Use the blurb as `description` verbatim
- `deepLink`: empty string (not present in paste)
- `discount`: e.g. "15% off (A$45.05 vs A$53.00)"
- `category`: infer from merchant type (e.g. "Experiences & Attractions", "Wildlife & Zoos")

### `rewardgateway`
Format: merchant name, truncated blurb, "Earn X%" or "Save X%", Check offers URL.
- Use the blurb as `description` verbatim (truncated is fine)
- `deepLink`: extract the Check offers URL exactly as it appears
- `discount`: e.g. "Earn 9% cashback" or "Save 5%"
- `category`: infer from merchant type

### `bupa` — eGift cards
Format: merchant name, discount %, URL.
- `description`: empty string (no blurb in paste)
- `deepLink`: extract URL exactly
- `discount`: e.g. "4% off eGift card"
- `category`: "eGift Cards"

### `bupa` — restaurants
Format: price tier ($ $ $), merchant name, suburb, discount %, URL.
- `description`: include suburb, e.g. "Located in Sans Souci"
- `deepLink`: extract URL exactly
- `discount`: e.g. "8% off dining"
- `category`: "Dining"

### `bupa` — travel
Format: mixed — prose offer descriptions with embedded URLs, and some eGift card entries.
- Extract merchant name from the offer description text
- `description`: the offer description text verbatim
- `deepLink`: extract URL exactly
- `discount`: extract the offer value from the description text, e.g. "Save up to $500 on Economy fares", "15% off travel insurance"
- `category`: "Travel"

### `qantas_shopping`
Format: merchant name, points per $1 spent, optional promo badge (BONUS POINTS, FREE SHIPPING etc).
- `description`: include promo badge if present, e.g. "Bonus points offer available"
- `deepLink`: empty string (not present in paste)
- `discount`: e.g. "4 Qantas pts per $1 spent"
- `category`: infer from merchant type

### `qantas_money`
Manual entry only — no AI import prompt needed. User types merchants directly.

### `westpac_altitude`
Format: merchant name, cashback %, optional bonus cashback %, optional end date.
- `description`: include bonus and expiry if present, e.g. "Includes 2% Westpac bonus cashback, ends soon"
- `deepLink`: empty string (not present in paste)
- `discount`: e.g. "Up to 7% cashback (incl. 1% Westpac bonus)"
- `category`: infer from merchant type
- Note: offers rotate frequently — `addedAt` timestamp is important for freshness awareness

### `commbank_yello`
Manual entry only — no AI import prompt needed. User types merchants directly.

### `everyday_rewards`
Format: linked/unlinked status, merchant name, points rate or specific offer, deep links.
- Skip points-transfer partners (Westpac, St.George, Bank of Melbourne, BankSA, Amex, ANZ, ALL Accor, Qantas FF) — only extract shopping/spending partners
- `description`: the offer description text verbatim
- `deepLink`: extract the "Shop now" or "Join and link" URL
- `discount`: e.g. "1 Everyday Rewards pt per $1 spent", "Save 4c/L on fuel"
- `category`: infer from merchant type

### `velocity_ff`
Format: merchant name, fixed point grant (e.g. "10,000 Points"), URL.
- `description`: empty string
- `deepLink`: extract URL exactly
- `discount`: e.g. "10,000 Velocity pts (one-off)"
- `category`: infer from merchant type

### `velocity_shopping`
Format: merchant name, points per $1 (e.g. "AU$1 = 6 Points"), optional "was X points" bonus context, URL.
- `description`: include bonus context if present, e.g. "Currently boosted from 2 pts per $1"
- `deepLink`: extract URL exactly
- `discount`: e.g. "6 Velocity pts per $1 spent"
- `category`: infer from merchant type

---

## AI Import — Merge Behaviour

The AI import modal must support two merge modes, selectable via a checkbox in the modal:

- **"Replace existing"** (default on first import for a program): wipes all existing merchants for the selected program before merging extracted merchants in
- **"Add to existing"** (default after first import): merges extracted merchants into existing data using the standard `importFromJson` merge logic (incoming overwrites by merchant `id`, existing merchants not in the paste are left untouched)

The checkbox should default to "Add to existing" if the selected program already has merchants, and "Replace existing" if the program is empty.

This is required for programs with paginated results (e.g. RewardGateway "load more") where the user must paste in multiple batches. Consistent merchant `id` slugs (kebab-case of name only) ensure duplicates are handled correctly across batches.

---

## Navigation — Programs Screen

The bottom nav has **two tabs only**:
- **Search** — primary use case, fuzzy search across all merchants
- **Programs** — replaces both the old Browse tab and Manage tab

### Programs screen layout
A card for each of the 10 programs showing:
- Program name
- Merchant count (e.g. "47 merchants")
- Last imported date (most recent `addedAt` across all merchants in that program, formatted as e.g. "Last updated 2 weeks ago"). If no merchants, show "No data yet".
- **Import** button — opens AI import modal pre-selected for that program
- For manual-entry programs (Qantas Money, CommBank Yello): show "Manual entry" label instead of Import button

### Data management
The Export Backup and Import Backup buttons move to the Programs screen (e.g. as a footer row below the program cards).

---

## v2 Compatibility Notes

v2 will add a Claude-powered chat interface. The user can ask questions like "I want to buy an iPad, what perks do I have?" The full benefits JSON from localStorage is sent as context in a single API call — no vector DB or embeddings.

**v2 requirements must NOT influence Phase 1–5 decisions**, but avoid choices that conflict with it:
- Keep merchant `description` fields populated where source text is available
- The single `index.html` structure will likely need refactoring into multiple JS modules before v2 — note this in the Phase 6 retro
- Do not add unnecessary state complexity that would make the data shape hard to pass as JSON context

---

## Phases

### Phase 1 — Project Scaffold + Data Layer ✅
### Phase 2 — App Shell + PWA Setup ✅
### Phase 3 — Search + Browse ✅
### Phase 4 — AI Import ✅

### Phase 5 — Import Fixes + Programs Screen ✅

### Phase 6 — Polish + Install Guide
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
├── sw.js               # Service worker (currently perks-v3 — bump to perks-v5 in Phase 5)
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

The Claude API model for AI import is `claude-sonnet-4-6`. Do not substitute a different model ID.

---

## Progress

### Phase 4 — 2026-05-30
- **Completed:** AI Import modal (program select + paste → Extract with AI → preview → Confirm & Merge), Export Backup, Import Backup, `buildImportPayload` + `parseExtractedMerchants` in data.js, SW cache bumped to `perks-v2` (SW staleness hotfix), 16 new tests (91 total)
- **Key decisions:**
  - `buildImportPayload` and `parseExtractedMerchants` are pure functions in `data.js` (not the app script) so the full AI pipeline is testable in Node.js without mocking `fetch`.
  - `parseExtractedMerchants` stamps `addedAt` and forces `program` itself (via `Object.assign`) — does not trust Claude to supply them correctly.
  - Direct browser API call using `anthropic-dangerous-direct-browser-access: true` header — no backend proxy needed, app stays fully static.
  - Bottom-sheet modal (slides up from bottom) matches Android native UX on the target device.
  - SW cache name bumped `perks-v1` → `perks-v2` to force browsers to re-fetch updated `data.js` after Phase 3 deploy.

### Phase 5 — 2026-05-31
- **Completed:** Schema trimmed to 10 programs (removed bankwest, shopback, jbhifi_perks), `buildImportPayload` rewritten with 8 per-program prompt variants (fixed merchant ID slug bug), merge mode checkbox added to AI import modal, Browse + Manage tabs replaced by single Programs screen (10 program cards with count + last-updated + Import/Manual-entry), Export/Import Backup moved to Programs screen footer, SW cache bumped to `perks-v5`, `generate-index.js` rewritten as in-place patcher, 101 tests (10 new)
- **Key decisions:**
  - Per-program prompts are extract-only (no generated descriptions for most programs) — resolves the production non-streaming hang from large NRMA/RewardGateway pastes.
  - `generate-index.js` rewritten as an in-place patcher (reads index.html, replaces Fuse.js IIFE, writes back) rather than a hardcoded template that drifts out of sync.
  - `PROGRAMS` constant is the single source of truth for `renderPrograms()` — adding/removing a program automatically updates the Programs screen.
  - Merge mode checkbox default is set via `loadData()` at change-event time — Replace if program is empty, Add if it has data.

### Post-Phase 4 production fixes — 2026-05-31
- **Fixed:** CORS header corrected (`anthropic-dangerous-direct-browser-calls` → `anthropic-dangerous-direct-browser-access`), SW cache bumped to `perks-v3`, model updated to `claude-sonnet-4-6` (replacing deprecated `claude-sonnet-4-20250514`), `max_tokens` bumped to 64000.
- **Identified:** non-streaming hang for large portal pastes (hundreds of merchants) — root cause is zero TTFB until full response ready. Resolved in Phase 5 via per-program prompt variants that eliminate description generation and reduce output tokens.

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
  - `index.html` uses `<script src="data.js">` rather than fully inlining data.js — avoids maintaining two copies; all files are cached by the service worker so offline still works. Can be inlined in Phase 6 if needed.
  - PNG icons generated via `create-icons.js` (Node.js core only, no dependencies) — produces solid #4f7eff fills. Can be replaced with a proper branded icon in Phase 6.
  - `loadApiKey`/`saveApiKey`/`clearApiKey` added to `data.js` (not just HTML) to keep them testable.
  - SW uses cache-first strategy; core assets (index.html, data.js, manifest.json) are required in the install cache; icons are best-effort (Promise.allSettled).
  - Browse screen in Phase 2 shows a read-only program list with merchant counts — useful immediately, won't conflict with Phase 3 category filtering.

### Phase 1 — 2026-05-30
- **Completed:** `data.js` (schema, pre-seed, export, import, merge), `test.js` (40 tests, all passing), `docs/` folder created
- **Key decisions:**
  - `data.js` is a standalone module (browser + Node.js compatible via `module.exports` guard) — will be inlined into `index.html` in Phase 2.
  - Seed data: 65 merchants (5 × 13 programs), verbose LLM-friendly descriptions, fixed `addedAt` timestamps for test determinism.
  - Merge strategy: incoming overwrites existing by merchant `id`; programs absent from import are left untouched.
  - `downloadExport` is browser-only (guarded with `typeof document === 'undefined'` check); `getExportJson` is testable in Node.js.