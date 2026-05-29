# Retro Notes

---

## Session 1 — 2026-05-30

### What was built
- **CLAUDE.md** — full project context, 13-program list, localStorage schema, phased build plan, and working rules for all future sessions
- **Phase 1 — Data layer** (`data.js`, `test.js`): schema + validation, pre-seed (65 verbose placeholder merchants across 13 programs), export (JSON download), import (file upload + merge), full merge logic. 40 tests.
- **Phase 2 — App shell + PWA** (`index.html`, `manifest.json`, `sw.js`, icons): dark/light adaptive mobile UI with bottom nav (Search, Browse, Manage screens), API key settings with save/clear, stat strip, PWA manifest, cache-first service worker, PNG icon generator. 21 additional tests (61 total, all passing).

### What worked well
- Starting with the pure data layer (Phase 1) before any UI meant the schema and merge logic were solid and fully tested before anything visual was built.
- Keeping `data.js` as a standalone Node.js-compatible module (rather than inlining it immediately) made testing straightforward — `require('./data.js')` just works.
- The CSS custom property approach (`--bg`, `--accent`, etc.) with a `prefers-color-scheme: light` override gave clean light/dark support with minimal code.
- The `create-icons.js` PNG generator using only Node.js core (zlib + Buffer) avoided adding any npm dependency just for a one-off asset.

### What was tricky
- **Icon format decision**: Chrome Android requires PNG for PWA install (SVG alone isn't enough). Solved with the pure-Node PNG generator — but the icons are currently solid-color only. A proper branded icon with the "P" letter would require a canvas-capable tool.
- **data.js inline vs. `<script src="data.js">`**: The architecture doc says "all JS bundled inline", but keeping a duplicate copy in index.html creates a maintenance burden with no build tooling. Chose `<script src="data.js">` for now — all files are SW-cached so offline still works. This is worth revisiting in Phase 5.
- **`const` in browser scripts**: confirmed that top-level `const`/`let` declarations in classic `<script>` tags share the global lexical scope across script tags on the same page, so `data.js` globals are accessible in the inline app script.

### Watch out for in the next session (Phase 3)
- **Fuse.js inline bundling**: Phase 3 requires Fuse.js for fuzzy search. It must be copied from the npm package source (`node_modules/fuse.js/dist/fuse.js` after `npm install fuse.js --no-save`, or downloaded from a release) and pasted inline into `index.html`. Do NOT add a CDN `<script src>` tag — security decision.
- **Search result rendering**: The Search screen currently shows an empty state. Phase 3 will wire up the `#search-input` event to Fuse.js and populate `#search-results` with `.result-item` elements. The HTML structure and CSS for those are already in index.html.
- **Browse category grid**: Phase 3 replaces the flat program list with a category grid → filtered merchant list flow. The `#browse-programs` div will be repurposed. Consider whether to add a "back" affordance or keep a flat list with category filters.
- **Deep links**: Most seed data has `deepLink: ''`. When search results render, only show the link arrow if `deepLink` is non-empty.
- **Test runner working directory**: `node test.js` must be run from the project root (`C:\Users\Henderson\Coding Projects\perks-finder\`) for `fs.readFileSync('./manifest.json', ...)` to resolve correctly.

---

## Session 2 — 2026-05-30

### What was built
- **Git setup**: initialised repo, configured identity (`hendo` / `henderson.koh@gmail.com`), pushed to `henderson-koh/perks-finder` on GitHub. Added `.gitignore` (excludes `node_modules/`, `fuse_source.txt`, `package-lock.json`).
- **Phase 3 — Search + Browse** (`data.js`, `index.html`, `test.js`, `generate-index.js`):
  - Fuzzy search wired to Fuse.js v7.3.0 — real-time results showing program badge, merchant name, discount; deep link navigation on tap; empty and no-results states.
  - Browse screen replaced with 2-column category grid; tap a category to drill down into a filtered merchant list; back button returns to the grid.
  - Three new `data.js` helpers: `getAllMerchants()`, `getCategoryList()`, `getMerchantsByCategory()`.
  - `generate-index.js` utility: splices Fuse.js source into `index.html` at build time so the minified library stays readable in diffs.
  - 14 new tests (75 total, all passing).

### What worked well
- Wrapping the Fuse.js CJS build in a simple IIFE (`var Fuse = (function(){ var module={exports:{}}; [source]; return module.exports; })()`) required no changes to the library source.
- Extracting the three helpers into `data.js` kept all testable logic out of the browser-only app script.
- Event delegation for cat cards and result items (not inline onclick) keeps the HTML safe against user-controlled data ending up in handler strings.
- The `generate-index.js` approach cleanly solves the backtick-in-template-literal problem and is reusable if more libraries need inlining in Phase 5.

### What was tricky
- **Fuse.js v7 dropped the UMD build**: v6.x had `dist/fuse.js` (UMD). v7.x ships only CJS and ESM. The IIFE wrapper was needed; confirmed in Node eval before inlining.
- **Bash heredoc vs. backticks**: Fuse.js source contains backtick characters that broke bash template literals. Solved with a dedicated `generate-index.js` Node script.
- **GitHub credential mismatch**: Git was storing credentials for `he-koh` rather than `henderson-koh`. Fixed by embedding the username in the remote URL (`https://henderson-koh@github.com/...`).

### Watch out for in the next session (Phase 4)
- **Invalidate search index after import**: set `fuseInstance = null` after Phase 4 AI import merges new merchants so the next search rebuilds with fresh data.
- **AI import model**: use `claude-sonnet-4-20250514` (specified in CLAUDE.md). Do not substitute a different model ID.
- **Prompt design**: the extraction prompt needs the full merchant schema and target program ID so the model fills `program` correctly. Return a JSON array of merchant objects.
- **Preview before merge**: show extracted merchants before committing — let the user cancel. `importFromJson` merge logic is already tested.
- **Test runner working directory**: `node test.js` must be run from the project root.

---

## Session 3 — 2026-05-30

### What was built
- **SW cache fix**: Bumped CACHE from perks-v1 to perks-v2 in sw.js. Root cause: Phase 3 added new functions to data.js but deployed browsers were serving the stale Phase 2 data.js from the old SW cache, causing "ReferenceError: getCategoryList is not defined" on GitHub Pages.
- **Phase 4 — AI Import** (data.js, generate-index.js, index.html, test.js):
  - Two new pure functions in data.js: buildImportPayload(programId, programName, rawText) assembles the Claude API request body; parseExtractedMerchants(content, programId) strips code fences, parses JSON, validates each merchant, and stamps addedAt + forces program to the correct programId.
  - Manage screen: AI Import card (opens modal) + Data card (Export Backup / Import Backup).
  - Bottom-sheet modal — 2-step flow: (1) program selector + textarea → Extract with AI → fetch to api.anthropic.com/v1/messages with anthropic-dangerous-direct-browser-calls: true; (2) merchant preview list → Confirm & Merge.
  - After merge: fuseInstance = null to invalidate search index; manage stats refreshed; modal closes with success flash.
  - Export Backup: downloadExport() as file download. Import Backup: FileReader → importFromJson() with error handling.
  - 16 new tests (91 total, all passing).
  - index.html rebuilt: 58,583 bytes.

### What worked well
- Keeping buildImportPayload and parseExtractedMerchants as pure functions in data.js (not the app script) means the entire AI data pipeline is testable in Node.js without mocking fetch.
- Forcing program and addedAt in parseExtractedMerchants (not trusting Claude to supply them correctly) makes the import robust — Claude only needs to get name/category/discount/description/deepLink right.
- The bottom-sheet modal pattern (slides up from bottom, tap-outside to dismiss) fits the Android native UX pattern on the target device.
- anthropic-dangerous-direct-browser-calls: true enables direct API calls without a backend proxy — keeps the app fully static.

### What was tricky
- **SW cache staleness**: Classic service worker gotcha — bumping CACHE_NAME is required any time a cached asset changes in a breaking way. The Phase 3 deploy didn't bump the version, so browsers with the old SW served stale data.js. Fix was a 1-line change to sw.js.
- **buildImportPayload timestamp**: parseExtractedMerchants stamps its own now value (overriding whatever Claude put) via Object.assign({}, m, { program, addedAt: now }). This makes addedAt reliable regardless of what the model outputs.
- **Retro scripting**: backtick characters in retro content kept breaking bash heredocs and inline node -e. Worked around each time by writing a temporary .js file and running node on it (same approach as generate-index.js).

### Watch out for in the next session (Phase 5)
- **SW cache version**: whenever index.html, data.js, or sw.js changes in a breaking way, bump CACHE in sw.js (currently perks-v2). Phase 5 changes will require another bump to perks-v3.
- **AI import UX edge cases**: the preview shows name + category + discount only. Phase 5 could optionally add a per-row delete button in the preview list, but it is not required.
- **index.html size**: at 58KB the file is manageable, but Phase 5 polish may grow it further. Consider extracting the app script to app.js (SW-cached) if it gets unwieldy.
- **v2 note**: per CLAUDE.md, the Phase 5 retro must note that index.html will need a JS module refactor before v2.
- **Test runner**: run node test.js from the project root.

---
