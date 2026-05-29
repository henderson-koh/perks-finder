// One-time generator: writes index.html with Fuse.js inlined.
// Run: node generate-index.js
const fs = require('fs');

const fuseSource = fs.readFileSync('./node_modules/fuse.js/dist/fuse.min.cjs', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0c0c10">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Perks">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <title>Perks Finder</title>
  <style>
    /* ── Reset & custom properties ──────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0c0c10;
      --surface:  #18181f;
      --surface2: #20202a;
      --border:   #28283a;
      --accent:   #4f7eff;
      --accent2:  #3a6ce0;
      --text:     #e8e8f0;
      --text2:    #7878a0;
      --text3:    #454560;
      --ok:       #30d158;
      --danger:   #ff453a;
      --nav-h:    60px;
      --sb:       env(safe-area-inset-bottom, 0px);
    }

    @media (prefers-color-scheme: light) {
      :root {
        --bg:      #f2f2f7;
        --surface: #ffffff;
        --surface2:#f0f0f5;
        --border:  #d8d8e8;
        --accent:  #2b5ce6;
        --accent2: #1f4ec4;
        --text:    #1a1a2a;
        --text2:   #606080;
        --text3:   #a0a0be;
        --ok:      #28a745;
        --danger:  #dc3545;
      }
    }

    /* ── Base ─────────────────────────────────────────────────────── */
    html, body { height: 100%; overflow: hidden; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      font-size: 16px;
      line-height: 1.5;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
    }

    /* ── App shell ────────────────────────────────────────────────── */
    #app {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 480px;
      margin: 0 auto;
    }

    #main {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .screen {
      display: none;
      position: absolute;
      inset: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .screen.active { display: block; }

    /* ── Bottom nav ───────────────────────────────────────────────── */
    #nav {
      display: flex;
      height: calc(var(--nav-h) + var(--sb));
      padding-bottom: var(--sb);
      background: var(--surface);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    .nav-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      border: none;
      background: none;
      color: var(--text2);
      cursor: pointer;
      font-size: 11px;
      font-family: inherit;
      font-weight: 500;
      min-height: 44px;
      padding: 6px 0;
      transition: color 0.12s;
    }

    .nav-btn svg {
      width: 22px; height: 22px;
      stroke: currentColor; fill: none;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
    }

    .nav-btn.active { color: var(--accent); }

    /* ── Search screen ────────────────────────────────────────────── */
    .search-wrap {
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 12px 16px 10px;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
    }

    .search-wrap input {
      display: block;
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-family: inherit;
      font-size: 16px;
      padding: 11px 14px 11px 40px;
      outline: none;
      transition: border-color 0.15s;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237878a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 13px center;
      background-size: 17px;
    }

    .search-wrap input:focus { border-color: var(--accent); }
    .search-wrap input::placeholder { color: var(--text3); }

    #search-results { padding: 8px 0 16px; }

    .result-item {
      display: flex;
      align-items: center;
      padding: 13px 16px;
      gap: 12px;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      transition: background 0.1s;
    }

    .result-item:active { background: var(--surface); }

    .result-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--accent);
      background: color-mix(in srgb, var(--accent) 15%, transparent);
      padding: 2px 7px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-body { flex: 1; min-width: 0; }

    .result-name {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-discount {
      font-size: 13px;
      color: var(--text2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-arrow { color: var(--text3); font-size: 18px; flex-shrink: 0; }

    /* ── Browse screen ────────────────────────────────────────────── */
    .screen-header {
      padding: 20px 16px 4px;
    }

    .screen-header h2 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.4px;
    }

    /* Category grid */
    .cat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 12px 16px 24px;
    }

    .cat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 14px;
      cursor: pointer;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: background 0.1s;
    }

    .cat-card:active { background: var(--surface2); }

    .cat-name {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
    }

    .cat-count {
      font-size: 12px;
      color: var(--text2);
      margin-top: 6px;
    }

    /* Drill-down header */
    .drill-header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .back-btn {
      background: none;
      border: none;
      color: var(--accent);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      padding: 8px 0;
      min-height: 44px;
      white-space: nowrap;
    }

    .drill-title {
      font-size: 17px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ── Manage / Settings screen ──────────────────────────────────── */
    .card {
      margin: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: var(--text2);
      margin-bottom: 12px;
    }

    .setting-label {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .setting-desc {
      font-size: 13px;
      color: var(--text2);
      margin-bottom: 12px;
      line-height: 1.45;
    }

    /* ── Inputs ───────────────────────────────────────────────────── */
    input[type="text"],
    input[type="search"],
    input[type="password"] {
      display: block;
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font-family: inherit;
      font-size: 16px;
      padding: 12px 14px;
      outline: none;
      transition: border-color 0.15s;
      -webkit-appearance: none;
    }

    input[type="text"]:focus,
    input[type="password"]:focus { border-color: var(--accent); }

    input[type="text"]::placeholder,
    input[type="password"]::placeholder { color: var(--text3); }

    /* ── Buttons ──────────────────────────────────────────────────── */
    .btn-row {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    .btn {
      height: 44px;
      padding: 0 20px;
      border: none;
      border-radius: 9px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
      transition: opacity 0.12s;
    }

    .btn:active { opacity: 0.7; }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-ghost   { background: var(--surface2); color: var(--danger); border: 1px solid var(--border); }

    /* ── Status messages ──────────────────────────────────────────── */
    .status-msg {
      font-size: 13px;
      margin-top: 8px;
      min-height: 18px;
      transition: opacity 0.3s;
    }

    .status-msg.ok  { color: var(--ok); }
    .status-msg.err { color: var(--danger); }

    /* ── Empty state ──────────────────────────────────────────────── */
    .empty-state {
      padding: 56px 32px;
      text-align: center;
      color: var(--text2);
    }

    .empty-icon {
      font-size: 52px;
      margin-bottom: 16px;
      line-height: 1;
    }

    .empty-state p       { font-size: 16px; margin-bottom: 6px; color: var(--text); }
    .empty-state .hint   { font-size: 14px; color: var(--text2); }

    /* ── Stat strip (Manage) ──────────────────────────────────────── */
    .stat-strip {
      display: flex;
      margin: 16px 16px 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
    }

    .stat-item {
      flex: 1;
      padding: 14px 12px;
      text-align: center;
      border-right: 1px solid var(--border);
    }

    .stat-item:last-child { border-right: none; }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--accent);
    }

    .stat-label {
      font-size: 11px;
      color: var(--text2);
      font-weight: 500;
      margin-top: 1px;
    }

    /* ── Modal (bottom sheet) ─────────────────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 100;
      display: flex;
      align-items: flex-end;
    }

    .modal {
      background: var(--surface);
      border-radius: 20px 20px 0 0;
      width: 100%;
      max-height: 88vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: calc(24px + var(--sb));
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 14px;
      position: sticky;
      top: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      z-index: 1;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .modal-close {
      width: 30px; height: 30px;
      background: var(--surface2);
      border: none;
      border-radius: 50%;
      color: var(--text2);
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      flex-shrink: 0;
    }

    .modal-body { padding: 16px 20px 0; }

    .modal-select {
      display: block;
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font-family: inherit;
      font-size: 16px;
      padding: 12px 14px;
      outline: none;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .modal-select:focus { border-color: var(--accent); }

    .modal-textarea {
      display: block;
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font-family: inherit;
      font-size: 15px;
      padding: 12px 14px;
      outline: none;
      resize: vertical;
      min-height: 140px;
      line-height: 1.5;
      -webkit-appearance: none;
    }

    .modal-textarea:focus { border-color: var(--accent); }
    .modal-textarea::placeholder { color: var(--text3); }

    .preview-item {
      padding: 11px 0;
      border-bottom: 1px solid var(--border);
    }

    .preview-item:last-child { border-bottom: none; }

    /* ── Key status indicator ─────────────────────────────────────── */
    .key-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
      padding: 3px 9px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .key-indicator.set {
      background: color-mix(in srgb, var(--ok) 15%, transparent);
      color: var(--ok);
    }

    .key-indicator.unset {
      background: var(--surface2);
      color: var(--text2);
    }
  </style>
</head>
<body>
<div id="app">
  <main id="main">

    <!-- Search -->
    <section id="screen-search" class="screen active">
      <div class="search-wrap">
        <input id="search-input" type="search"
               placeholder="Search merchants, categories…"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      </div>
      <div id="search-results"></div>
      <div id="search-empty" class="empty-state">
        <div class="empty-icon">&#128269;</div>
        <p>Search your perks</p>
        <p class="hint">Type a merchant or category name</p>
      </div>
    </section>

    <!-- Browse -->
    <section id="screen-browse" class="screen">
      <div id="browse-cat-view">
        <div class="screen-header">
          <h2>Browse</h2>
        </div>
        <div id="browse-categories" class="cat-grid"></div>
      </div>
      <div id="browse-drill-view" style="display:none">
        <div class="drill-header">
          <button id="browse-back" class="back-btn">&#8592; Back</button>
          <span id="browse-cat-title" class="drill-title"></span>
        </div>
        <div id="browse-merchant-list"></div>
      </div>
    </section>

    <!-- Manage -->
    <section id="screen-manage" class="screen">
      <div class="screen-header">
        <h2>Manage</h2>
      </div>

      <div class="stat-strip">
        <div class="stat-item">
          <div class="stat-value" id="stat-programs">&mdash;</div>
          <div class="stat-label">Programs</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" id="stat-merchants">&mdash;</div>
          <div class="stat-label">Merchants</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">AI Import</div>
        <p class="setting-desc">Paste raw text from a benefits portal and Claude will extract merchants automatically.</p>
        <div class="btn-row">
          <button id="btn-ai-import" class="btn btn-primary">Import with AI</button>
        </div>
        <p id="ai-import-status" class="status-msg"></p>
      </div>

      <div class="card">
        <div class="card-title">Data</div>
        <p class="setting-desc">Export a backup of all your perks data, or restore from a previous backup.</p>
        <div class="btn-row">
          <button id="btn-export" class="btn btn-primary">Export Backup</button>
          <button id="btn-import-file" class="btn btn-ghost" style="color:var(--text)">Import Backup</button>
        </div>
        <input id="import-file-input" type="file" accept=".json" style="display:none">
        <p id="data-status" class="status-msg"></p>
      </div>

      <div class="card">
        <div class="card-title">Claude API Key</div>
        <div id="key-indicator" class="key-indicator unset">
          <span id="key-dot">&#9679;</span>
          <span id="key-indicator-label">No key saved</span>
        </div>
        <div class="setting-desc">
          Used to import perks with AI. Stored only on this device &mdash; never sent anywhere except Anthropic&rsquo;s API.
        </div>
        <input id="api-key-input" type="password"
               placeholder="sk-ant-&hellip;"
               autocomplete="off" autocorrect="off" spellcheck="false">
        <div class="btn-row">
          <button id="btn-save-key" class="btn btn-primary">Save Key</button>
          <button id="btn-clear-key" class="btn btn-ghost">Clear</button>
        </div>
        <p id="key-status" class="status-msg"></p>
      </div>
    </section>

  </main>

  <!-- AI Import Modal -->
  <div id="import-modal" class="modal-overlay" style="display:none" role="dialog" aria-modal="true" aria-labelledby="modal-title-text">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title" id="modal-title-text">Import with AI</span>
        <button id="modal-close" class="modal-close" aria-label="Close">&times;</button>
      </div>

      <div id="modal-step-input" class="modal-body">
        <p class="setting-desc" style="margin-bottom:14px">Select the program, then paste raw text from the benefits portal. Claude will extract the merchants automatically.</p>
        <div class="setting-label">Program</div>
        <select id="modal-program-select" class="modal-select">
          <option value="">Select a program&hellip;</option>
          <option value="rewardgateway">Work RewardGateway</option>
          <option value="nrma">NRMA</option>
          <option value="bupa">Bupa</option>
          <option value="qantas_shopping">Qantas Shopping Portal</option>
          <option value="qantas_money">Qantas FF Card (Qantas Money)</option>
          <option value="bankwest">Bankwest CC (More Rewards)</option>
          <option value="westpac_altitude">Westpac Altitude Qantas Black</option>
          <option value="commbank_yello">CommBank CC (Yello)</option>
          <option value="everyday_rewards">Everyday Rewards</option>
          <option value="shopback">ShopBack</option>
          <option value="jbhifi_perks">JB Hi-Fi Perks</option>
          <option value="velocity_ff">Velocity FF</option>
          <option value="velocity_shopping">Velocity Shopping Portal</option>
        </select>
        <div class="setting-label" style="margin-top:14px">Pasted text</div>
        <textarea id="modal-paste" class="modal-textarea" placeholder="Paste benefit portal text here&hellip;" rows="8"></textarea>
        <div class="btn-row" style="margin-top:14px">
          <button id="modal-extract-btn" class="btn btn-primary">Extract with AI</button>
        </div>
        <p id="modal-status" class="status-msg"></p>
      </div>

      <div id="modal-step-preview" class="modal-body" style="display:none">
        <p id="modal-preview-summary" class="setting-desc" style="margin-bottom:14px"></p>
        <div id="modal-preview-list"></div>
        <div class="btn-row" style="margin-top:14px">
          <button id="modal-confirm-btn" class="btn btn-primary">Confirm &amp; Merge</button>
          <button id="modal-back-btn" class="btn btn-ghost" style="color:var(--text)">Back</button>
        </div>
        <p id="modal-confirm-status" class="status-msg"></p>
      </div>
    </div>
  </div>

  <!-- Bottom nav -->
  <nav id="nav">
    <button class="nav-btn active" data-screen="search" aria-label="Search">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <span>Search</span>
    </button>
    <button class="nav-btn" data-screen="browse" aria-label="Browse">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span>Browse</span>
    </button>
    <button class="nav-btn" data-screen="manage" aria-label="Manage">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
      <span>Manage</span>
    </button>
  </nav>
</div>

<!-- Fuse.js v7.3.0 inline (no CDN) -->
<script>
var Fuse = (function() {
  var module = { exports: {} };
  ${fuseSource}
  return module.exports;
})();
</script>

<script src="data.js"></script>
<script>
// ── Navigation ────────────────────────────────────────────────────────────
let currentScreen = 'search';

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.screen;
    if (id === currentScreen) return;
    currentScreen = id;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (id === 'search') {
      setTimeout(() => document.getElementById('search-input').focus(), 50);
    }
    if (id === 'browse') {
      showBrowseCatView();
      renderBrowse();
    }
    if (id === 'manage') refreshManageStats();
  });
});

// ── Search ────────────────────────────────────────────────────────────────
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchEmpty   = document.getElementById('search-empty');

let fuseInstance = null;

function buildSearchIndex() {
  fuseInstance = new Fuse(getAllMerchants(), {
    keys: [
      { name: 'name',        weight: 2   },
      { name: 'category',    weight: 1.5 },
      { name: 'discount',    weight: 1   },
      { name: 'programName', weight: 1   },
      { name: 'description', weight: 0.3 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}

function renderResultItem(m) {
  const arrow    = m.deepLink ? '<span class="result-arrow">&#8250;</span>' : '';
  const linkAttr = m.deepLink ? ' data-link="' + esc(m.deepLink) + '"' : '';
  return '<div class="result-item"' + linkAttr + '>' +
    '<div class="result-badge">' + esc(m.programName) + '</div>' +
    '<div class="result-body">' +
      '<div class="result-name">'     + esc(m.name)     + '</div>' +
      '<div class="result-discount">' + esc(m.discount) + '</div>' +
    '</div>' +
    arrow +
  '</div>';
}

searchInput.addEventListener('input', function() {
  const q = searchInput.value.trim();
  if (!q) {
    searchResults.innerHTML = '';
    searchEmpty.style.display = '';
    return;
  }
  searchEmpty.style.display = 'none';
  if (!fuseInstance) buildSearchIndex();
  const hits = fuseInstance.search(q, { limit: 40 });
  if (!hits.length) {
    searchResults.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-icon">&#128542;</div>' +
        '<p>No results for &ldquo;' + esc(q) + '&rdquo;</p>' +
        '<p class="hint">Try a different search term</p>' +
      '</div>';
    return;
  }
  searchResults.innerHTML = hits.map(r => renderResultItem(r.item)).join('');
});

searchResults.addEventListener('click', function(e) {
  const item = e.target.closest('.result-item');
  if (item && item.dataset.link) window.open(item.dataset.link, '_blank', 'noopener');
});

// ── Browse ────────────────────────────────────────────────────────────────
function showBrowseCatView() {
  document.getElementById('browse-cat-view').style.display   = '';
  document.getElementById('browse-drill-view').style.display = 'none';
}

function renderBrowse() {
  const cats      = getCategoryList();
  const container = document.getElementById('browse-categories');
  if (!cats.length) {
    container.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<div class="empty-icon">&#128193;</div>' +
        '<p>No data yet</p>' +
        '<p class="hint">Add perks via Manage</p>' +
      '</div>';
    return;
  }
  container.innerHTML = cats.map(cat => {
    const count = getMerchantsByCategory(cat).length;
    return '<div class="cat-card" data-cat="' + esc(cat) + '">' +
      '<span class="cat-name">'  + esc(cat) + '</span>' +
      '<span class="cat-count">' + count + ' perk' + (count !== 1 ? 's' : '') + '</span>' +
    '</div>';
  }).join('');
}

document.getElementById('browse-categories').addEventListener('click', function(e) {
  const card = e.target.closest('.cat-card');
  if (card) openCategory(card.dataset.cat);
});

function openCategory(cat) {
  document.getElementById('browse-cat-view').style.display   = 'none';
  document.getElementById('browse-drill-view').style.display = '';
  document.getElementById('browse-cat-title').textContent    = cat;
  document.getElementById('browse-merchant-list').innerHTML  =
    getMerchantsByCategory(cat).map(renderResultItem).join('');
}

document.getElementById('browse-back').addEventListener('click', function() {
  showBrowseCatView();
  renderBrowse();
});

document.getElementById('browse-merchant-list').addEventListener('click', function(e) {
  const item = e.target.closest('.result-item');
  if (item && item.dataset.link) window.open(item.dataset.link, '_blank', 'noopener');
});

// ── Manage ────────────────────────────────────────────────────────────────
function refreshManageStats() {
  const data = loadData();
  let programs = 0, merchants = 0;
  if (data) {
    programs = Object.keys(data.programs).length;
    for (const p of Object.values(data.programs)) merchants += p.merchants.length;
  }
  document.getElementById('stat-programs').textContent  = programs;
  document.getElementById('stat-merchants').textContent = merchants;
}

function refreshKeyIndicator() {
  const key = loadApiKey();
  const ind  = document.getElementById('key-indicator');
  const lbl  = document.getElementById('key-indicator-label');
  if (key) {
    ind.className = 'key-indicator set';
    lbl.textContent = 'Key saved';
    document.getElementById('api-key-input').value = key;
  } else {
    ind.className = 'key-indicator unset';
    lbl.textContent = 'No key saved';
    document.getElementById('api-key-input').value = '';
  }
}

const apiKeyInput = document.getElementById('api-key-input');
const keyStatus   = document.getElementById('key-status');

document.getElementById('btn-save-key').addEventListener('click', () => {
  const val = apiKeyInput.value.trim();
  if (!val) { flash(keyStatus, 'Enter an API key first.', 'err'); return; }
  saveApiKey(val);
  refreshKeyIndicator();
  flash(keyStatus, 'API key saved.', 'ok');
});

document.getElementById('btn-clear-key').addEventListener('click', () => {
  clearApiKey();
  refreshKeyIndicator();
  flash(keyStatus, 'API key cleared.', 'ok');
});

function flash(el, msg, type) {
  el.textContent = msg;
  el.className   = 'status-msg ' + type;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.textContent = ''; el.className = 'status-msg'; }, 3000);
}

// ── Export / Import backup ────────────────────────────────────────────────
document.getElementById('btn-export').addEventListener('click', function() {
  downloadExport();
  flash(document.getElementById('data-status'), 'Backup downloaded.', 'ok');
});

document.getElementById('btn-import-file').addEventListener('click', function() {
  document.getElementById('import-file-input').click();
});

document.getElementById('import-file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      importFromJson(evt.target.result);
      fuseInstance = null;
      refreshManageStats();
      flash(document.getElementById('data-status'), 'Backup restored successfully.', 'ok');
    } catch (err) {
      flash(document.getElementById('data-status'), 'Import failed: ' + err.message, 'err');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
});

// ── AI Import Modal ───────────────────────────────────────────────────────
let extractedMerchants = [];
let selectedProgramId   = '';
let selectedProgramName = '';

function openImportModal() {
  extractedMerchants  = [];
  selectedProgramId   = '';
  selectedProgramName = '';
  document.getElementById('modal-program-select').value = '';
  document.getElementById('modal-paste').value           = '';
  document.getElementById('modal-status').textContent    = '';
  document.getElementById('modal-status').className      = 'status-msg';
  showModalStep('input');
  document.getElementById('import-modal').style.display = '';
  setTimeout(() => document.getElementById('modal-program-select').focus(), 50);
}

function closeImportModal() {
  document.getElementById('import-modal').style.display = 'none';
}

function showModalStep(step) {
  document.getElementById('modal-step-input').style.display   = step === 'input'   ? '' : 'none';
  document.getElementById('modal-step-preview').style.display = step === 'preview' ? '' : 'none';
}

document.getElementById('btn-ai-import').addEventListener('click', openImportModal);
document.getElementById('modal-close').addEventListener('click', closeImportModal);

document.getElementById('import-modal').addEventListener('click', function(e) {
  if (e.target === this) closeImportModal();
});

document.getElementById('modal-extract-btn').addEventListener('click', async function() {
  const sel      = document.getElementById('modal-program-select');
  const paste    = document.getElementById('modal-paste').value.trim();
  const statusEl = document.getElementById('modal-status');

  if (!sel.value) { flash(statusEl, 'Select a program first.', 'err'); return; }
  if (!paste)     { flash(statusEl, 'Paste some text first.', 'err');  return; }

  const apiKey = loadApiKey();
  if (!apiKey) { flash(statusEl, 'No API key saved — add it below.', 'err'); return; }

  selectedProgramId   = sel.value;
  selectedProgramName = sel.options[sel.selectedIndex].text;

  const btn = this;
  btn.disabled    = true;
  btn.textContent = 'Extracting…';
  statusEl.textContent = '';
  statusEl.className   = 'status-msg';

  try {
    const payload  = buildImportPayload(selectedProgramId, selectedProgramName, paste);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':                          'application/json',
        'x-api-key':                             apiKey,
        'anthropic-version':                     '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error((errBody.error && errBody.error.message) || 'API error ' + response.status);
    }

    const result  = await response.json();
    const content = result.content && result.content[0] && result.content[0].text;
    if (!content) throw new Error('Empty response from Claude');

    const { merchants, skipped } = parseExtractedMerchants(content, selectedProgramId);
    if (!merchants.length) {
      flash(statusEl, 'No valid merchants found. Try pasting more detailed text.', 'err');
      return;
    }

    extractedMerchants = merchants;
    renderPreview(merchants, skipped);
    showModalStep('preview');
  } catch (e) {
    flash(statusEl, 'Error: ' + e.message, 'err');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Extract with AI';
  }
});

function renderPreview(merchants, skipped) {
  document.getElementById('modal-preview-summary').textContent =
    'Found ' + merchants.length + ' merchant' + (merchants.length !== 1 ? 's' : '') +
    (skipped ? ' (' + skipped + ' skipped — incomplete data)' : '') +
    '. Review and confirm to merge into ' + selectedProgramName + '.';

  document.getElementById('modal-preview-list').innerHTML =
    merchants.map(m =>
      '<div class="preview-item">' +
        '<div class="result-name">'     + esc(m.name)     + '</div>' +
        '<div class="result-discount">' + esc(m.category) + ' · ' + esc(m.discount) + '</div>' +
      '</div>'
    ).join('');
}

document.getElementById('modal-confirm-btn').addEventListener('click', function() {
  if (!extractedMerchants.length) return;

  const existing = loadData() || createEmptyData();
  const wrapped  = {
    version: 1,
    programs: {
      [selectedProgramId]: {
        id: selectedProgramId,
        name: selectedProgramName,
        merchants: extractedMerchants,
      },
    },
  };
  saveData(mergeData(existing, wrapped));
  fuseInstance = null;
  refreshManageStats();

  const count = extractedMerchants.length;
  closeImportModal();
  flash(
    document.getElementById('ai-import-status'),
    count + ' merchant' + (count !== 1 ? 's' : '') + ' merged into ' + selectedProgramName + '.',
    'ok'
  );
});

document.getElementById('modal-back-btn').addEventListener('click', function() {
  showModalStep('input');
});

// ── Utilities ─────────────────────────────────────────────────────────────
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────
preseedIfEmpty();
renderBrowse();
refreshManageStats();
refreshKeyIndicator();

// ── Service worker ────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
</script>
</body>
</html>`;

fs.writeFileSync('./index.html', html, 'utf8');
console.log('Written index.html —', html.length, 'bytes');
