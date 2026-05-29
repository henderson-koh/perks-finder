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
