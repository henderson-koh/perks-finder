// Perks Finder — unit tests
// Run: node test.js

const fs = require('fs');

// localStorage mock — must be set before requiring data.js
const _store = {};
global.localStorage = {
  getItem:    (k)    => _store[k] ?? null,
  setItem:    (k, v) => { _store[k] = String(v); },
  removeItem: (k)    => { delete _store[k]; },
  clear:      ()     => { Object.keys(_store).forEach(k => delete _store[k]); },
};

const {
  PROGRAMS,
  SEED_MERCHANTS,
  createEmptyData,
  validateMerchant,
  validateData,
  loadData,
  saveData,
  mergeData,
  getExportJson,
  importFromJson,
  preseedIfEmpty,
  loadApiKey,
  saveApiKey,
  clearApiKey,
  getAllMerchants,
  getCategoryList,
  getMerchantsByCategory,
  buildImportPayload,
  parseExtractedMerchants,
} = require('./data.js');

// ─── test runner ────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  localStorage.clear();
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error(message || `Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
}

// ─── schema validation ───────────────────────────────────────────────────────

console.log('\nSchema validation');

test('validateMerchant: valid merchant passes', () => {
  const m = {
    id: 'test-m', name: 'Test', program: 'rewardgateway', category: 'Retail',
    discount: '10% off', description: 'A test merchant for validation.', deepLink: '',
    addedAt: '2024-01-01T00:00:00.000Z',
  };
  assert(validateMerchant(m));
});

test('validateMerchant: missing field fails', () => {
  const m = { id: 'x', name: 'X', program: 'rewardgateway', category: 'Y', discount: 'Z', description: 'D' };
  assert(!validateMerchant(m), 'Missing deepLink and addedAt should fail');
});

test('validateMerchant: non-string field fails', () => {
  const m = {
    id: 'x', name: 'X', program: 'rg', category: 'Y', discount: 'Z',
    description: 'D', deepLink: '', addedAt: 123,
  };
  assert(!validateMerchant(m), 'Number addedAt should fail');
});

test('validateMerchant: null / undefined / string input fails', () => {
  assert(!validateMerchant(null));
  assert(!validateMerchant(undefined));
  assert(!validateMerchant('string'));
});

test('validateData: valid empty data passes', () => {
  assert(validateData(createEmptyData()));
});

test('validateData: wrong version fails', () => {
  const d = createEmptyData();
  d.version = 2;
  assert(!validateData(d));
});

test('validateData: missing programs fails', () => {
  assert(!validateData({ version: 1 }));
});

test('validateData: null input fails', () => {
  assert(!validateData(null));
  assert(!validateData(undefined));
});

test('validateData: program with non-array merchants fails', () => {
  const d = createEmptyData();
  d.programs.rewardgateway.merchants = 'not-an-array';
  assert(!validateData(d));
});

test('validateData: program with invalid merchant fails', () => {
  const d = createEmptyData();
  d.programs.rewardgateway.merchants = [{ id: 'incomplete' }];
  assert(!validateData(d));
});

test('createEmptyData: has exactly 13 programs', () => {
  assertEqual(Object.keys(createEmptyData().programs).length, 13);
});

test('createEmptyData: all programs have empty merchants arrays', () => {
  for (const prog of Object.values(createEmptyData().programs)) {
    assert(Array.isArray(prog.merchants) && prog.merchants.length === 0, `${prog.id} merchants not empty`);
  }
});

test('createEmptyData: all expected program ids are present', () => {
  const ids = Object.keys(createEmptyData().programs);
  const expected = [
    'rewardgateway','nrma','bupa','qantas_shopping','qantas_money',
    'bankwest','westpac_altitude','commbank_yello','everyday_rewards',
    'shopback','jbhifi_perks','velocity_ff','velocity_shopping',
  ];
  for (const id of expected) {
    assert(ids.includes(id), `Missing program id: ${id}`);
  }
});

// ─── pre-seed ────────────────────────────────────────────────────────────────

console.log('\nPre-seed');

test('preseedIfEmpty: returns true when seeding empty storage', () => {
  assert(preseedIfEmpty() === true);
});

test('preseedIfEmpty: data is saved to localStorage after seed', () => {
  preseedIfEmpty();
  assert(loadData() !== null);
});

test('preseedIfEmpty: all 13 programs present after seed', () => {
  preseedIfEmpty();
  assertEqual(Object.keys(loadData().programs).length, 13);
});

test('preseedIfEmpty: each program has exactly 5 merchants', () => {
  preseedIfEmpty();
  for (const [id, prog] of Object.entries(loadData().programs)) {
    assertEqual(prog.merchants.length, 5, `${id} should have 5 merchants`);
  }
});

test('preseedIfEmpty: all seeded merchants pass validateMerchant', () => {
  preseedIfEmpty();
  for (const prog of Object.values(loadData().programs)) {
    for (const m of prog.merchants) {
      assert(validateMerchant(m), `Invalid merchant: ${m.id}`);
    }
  }
});

test('preseedIfEmpty: merchant program field matches its parent program key', () => {
  preseedIfEmpty();
  for (const [progId, prog] of Object.entries(loadData().programs)) {
    for (const m of prog.merchants) {
      assertEqual(m.program, progId, `Merchant ${m.id} has wrong program field`);
    }
  }
});

test('preseedIfEmpty: returns false and does not overwrite existing data', () => {
  const existing = createEmptyData();
  existing.programs.rewardgateway.merchants = [{
    id: 'custom-m', name: 'Custom', program: 'rewardgateway', category: 'Test',
    discount: '1% off', description: 'A custom merchant that must survive a seed call.',
    deepLink: '', addedAt: '2024-06-01T00:00:00.000Z',
  }];
  saveData(existing);
  assert(preseedIfEmpty() === false, 'Should return false when data exists');
  const data = loadData();
  assertEqual(data.programs.rewardgateway.merchants.length, 1);
  assertEqual(data.programs.rewardgateway.merchants[0].id, 'custom-m');
});

test('preseedIfEmpty: all merchant descriptions are verbose (>50 chars)', () => {
  preseedIfEmpty();
  for (const prog of Object.values(loadData().programs)) {
    for (const m of prog.merchants) {
      assert(m.description.length > 50, `Merchant ${m.id} description too short: "${m.description.slice(0,30)}..."`);
    }
  }
});

test('preseedIfEmpty: all merchant ids are unique across all programs', () => {
  preseedIfEmpty();
  const ids = [];
  for (const prog of Object.values(loadData().programs)) {
    for (const m of prog.merchants) ids.push(m.id);
  }
  const unique = new Set(ids);
  assertEqual(unique.size, ids.length, 'Duplicate merchant ids found in seed data');
});

// ─── export ──────────────────────────────────────────────────────────────────

console.log('\nExport');

test('getExportJson: returns a string', () => {
  preseedIfEmpty();
  assert(typeof getExportJson() === 'string');
});

test('getExportJson: output is valid parseable JSON', () => {
  preseedIfEmpty();
  JSON.parse(getExportJson()); // throws if invalid
  assert(true);
});

test('getExportJson: exported data passes validateData', () => {
  preseedIfEmpty();
  assert(validateData(JSON.parse(getExportJson())));
});

test('getExportJson: round-trips without data loss', () => {
  preseedIfEmpty();
  const original = JSON.stringify(loadData());
  const roundTripped = JSON.stringify(JSON.parse(getExportJson()));
  assertEqual(original, roundTripped);
});

test('getExportJson: returns valid empty structure when localStorage is empty', () => {
  const parsed = JSON.parse(getExportJson());
  assert(validateData(parsed));
  assertEqual(Object.keys(parsed.programs).length, 13);
});

// ─── import ──────────────────────────────────────────────────────────────────

console.log('\nImport');

test('importFromJson: imports and saves valid data to localStorage', () => {
  preseedIfEmpty();
  const json = getExportJson();
  localStorage.clear();
  const merged = importFromJson(json);
  assert(validateData(merged));
  assert(loadData() !== null);
});

test('importFromJson: throws on malformed JSON', () => {
  let threw = false;
  try { importFromJson('not { valid json'); } catch (e) { threw = true; }
  assert(threw);
});

test('importFromJson: throws on valid JSON with wrong schema (version != 1)', () => {
  let threw = false;
  try { importFromJson('{"version":2,"programs":{}}'); } catch (e) { threw = true; }
  assert(threw);
});

test('importFromJson: throws on valid JSON with invalid merchant', () => {
  const bad = createEmptyData();
  bad.programs.rewardgateway.merchants = [{ id: 'incomplete' }];
  let threw = false;
  try { importFromJson(JSON.stringify(bad)); } catch (e) { threw = true; }
  assert(threw);
});

test('importFromJson: new merchants are added to existing data', () => {
  preseedIfEmpty();
  const newM = {
    id: 'brand-new-rewardgateway', name: 'Brand New Store', program: 'rewardgateway',
    category: 'Retail', discount: '20% off sitewide', description: 'A brand new store not present in seed data, added via import.',
    deepLink: 'https://example.com', addedAt: '2024-06-01T00:00:00.000Z',
  };
  const payload = createEmptyData();
  payload.programs.rewardgateway.merchants = [newM];
  const merged = importFromJson(JSON.stringify(payload));
  assert(merged.programs.rewardgateway.merchants.some(m => m.id === 'brand-new-rewardgateway'));
  assert(merged.programs.rewardgateway.merchants.length > 1, 'Existing merchants should remain');
});

test('importFromJson: incoming merchant with same id overwrites existing', () => {
  preseedIfEmpty();
  const existingId = loadData().programs.rewardgateway.merchants[0].id;
  const updated = {
    id: existingId, name: 'Updated Name', program: 'rewardgateway',
    category: 'Updated', discount: 'Updated discount',
    description: 'Updated description for the existing merchant after an AI import run.',
    deepLink: '', addedAt: '2024-06-01T00:00:00.000Z',
  };
  const payload = createEmptyData();
  payload.programs.rewardgateway.merchants = [updated];
  const merged = importFromJson(JSON.stringify(payload));
  const found = merged.programs.rewardgateway.merchants.find(m => m.id === existingId);
  assertEqual(found.name, 'Updated Name');
});

test('importFromJson: programs absent from import payload are preserved', () => {
  preseedIfEmpty();
  const payload = createEmptyData(); // all programs empty merchants
  const merged = importFromJson(JSON.stringify(payload));
  // Every seeded program should retain its 5 merchants
  for (const [id, prog] of Object.entries(merged.programs)) {
    assertEqual(prog.merchants.length, 5, `${id} merchants should be preserved`);
  }
});

test('importFromJson: persists result to localStorage', () => {
  preseedIfEmpty();
  const payload = createEmptyData();
  importFromJson(JSON.stringify(payload));
  assert(loadData() !== null);
});

// ─── merge logic ─────────────────────────────────────────────────────────────

console.log('\nMerge logic');

test('mergeData: adds new program from incoming', () => {
  const existing = createEmptyData();
  const incoming = createEmptyData();
  incoming.programs.extra = {
    id: 'extra', name: 'Extra Program',
    merchants: [{
      id: 'extra-m', name: 'Extra Merchant', program: 'extra', category: 'Test',
      discount: '5% off', description: 'An extra merchant added to test cross-program merging behaviour.',
      deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
    }],
  };
  const result = mergeData(existing, incoming);
  assert(result.programs.extra !== undefined);
  assertEqual(result.programs.extra.merchants.length, 1);
});

test('mergeData: does not mutate the existing object', () => {
  const existing = createEmptyData();
  const incoming = createEmptyData();
  incoming.programs.rewardgateway.merchants = [{
    id: 'new-m', name: 'New', program: 'rewardgateway', category: 'Test',
    discount: '5% off', description: 'New merchant used to verify mutation safety of mergeData.',
    deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
  }];
  mergeData(existing, incoming);
  assertEqual(existing.programs.rewardgateway.merchants.length, 0, 'existing should not be mutated');
});

test('mergeData: deduplicates by id — incoming wins', () => {
  const existing = createEmptyData();
  existing.programs.rewardgateway.merchants = [{
    id: 'dup', name: 'Old Name', program: 'rewardgateway', category: 'Test',
    discount: 'Old discount', description: 'Old description of the duplicate merchant.',
    deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
  }];
  const incoming = createEmptyData();
  incoming.programs.rewardgateway.merchants = [{
    id: 'dup', name: 'New Name', program: 'rewardgateway', category: 'Test',
    discount: 'New discount', description: 'New description of the duplicate merchant after overwrite.',
    deepLink: '', addedAt: '2024-06-01T00:00:00.000Z',
  }];
  const result = mergeData(existing, incoming);
  const merchants = result.programs.rewardgateway.merchants;
  assertEqual(merchants.length, 1);
  assertEqual(merchants[0].name, 'New Name');
});

test('mergeData: programs only in existing are preserved', () => {
  const existing = createEmptyData();
  existing.programs.nrma.merchants = [{
    id: 'nrma-m', name: 'NRMA Merchant', program: 'nrma', category: 'Travel',
    discount: '10% off', description: 'An NRMA merchant that should survive a merge affecting only rewardgateway.',
    deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
  }];
  const incoming = createEmptyData();
  incoming.programs.rewardgateway.merchants = [{
    id: 'rg-m', name: 'RG Merchant', program: 'rewardgateway', category: 'Retail',
    discount: '5% off', description: 'A RewardGateway merchant being merged in.',
    deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
  }];
  const result = mergeData(existing, incoming);
  assertEqual(result.programs.nrma.merchants.length, 1, 'NRMA merchants should be preserved');
  assertEqual(result.programs.nrma.merchants[0].id, 'nrma-m');
});

test('mergeData: non-overlapping merchants from both sides are all present', () => {
  const existing = createEmptyData();
  existing.programs.rewardgateway.merchants = [{
    id: 'existing-m', name: 'Existing', program: 'rewardgateway', category: 'Test',
    discount: '5% off', description: 'Existing merchant that should remain after merge.',
    deepLink: '', addedAt: '2024-01-01T00:00:00.000Z',
  }];
  const incoming = createEmptyData();
  incoming.programs.rewardgateway.merchants = [{
    id: 'incoming-m', name: 'Incoming', program: 'rewardgateway', category: 'Test',
    discount: '10% off', description: 'Incoming merchant that should be added alongside existing.',
    deepLink: '', addedAt: '2024-06-01T00:00:00.000Z',
  }];
  const result = mergeData(existing, incoming);
  const ids = result.programs.rewardgateway.merchants.map(m => m.id);
  assert(ids.includes('existing-m'));
  assert(ids.includes('incoming-m'));
  assertEqual(ids.length, 2);
});

// ─── PWA manifest ────────────────────────────────────────────────────────────

console.log('\nPWA manifest');

test('manifest.json: file exists', () => {
  assert(fs.existsSync('./manifest.json'), 'manifest.json should exist');
});

test('manifest.json: is valid JSON', () => {
  const raw = fs.readFileSync('./manifest.json', 'utf8');
  JSON.parse(raw); // throws if invalid
  assert(true);
});

test('manifest.json: has name and short_name', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  assert(typeof m.name === 'string' && m.name.length > 0, 'name required');
  assert(typeof m.short_name === 'string' && m.short_name.length > 0, 'short_name required');
});

test('manifest.json: display is standalone', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  assertEqual(m.display, 'standalone');
});

test('manifest.json: has start_url and scope', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  assert(typeof m.start_url === 'string', 'start_url required');
  assert(typeof m.scope === 'string', 'scope required');
});

test('manifest.json: has icons array with at least one entry', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  assert(Array.isArray(m.icons) && m.icons.length > 0);
});

test('manifest.json: each icon has src, sizes, and type', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  for (const icon of m.icons) {
    assert(typeof icon.src   === 'string' && icon.src.length   > 0, 'icon missing src');
    assert(typeof icon.sizes === 'string' && icon.sizes.length > 0, 'icon missing sizes');
    assert(typeof icon.type  === 'string' && icon.type.length  > 0, 'icon missing type');
  }
});

test('manifest.json: has theme_color and background_color', () => {
  const m = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
  assert(typeof m.theme_color      === 'string', 'theme_color required');
  assert(typeof m.background_color === 'string', 'background_color required');
});

// ─── Service worker ───────────────────────────────────────────────────────────

console.log('\nService worker');

test('sw.js: file exists', () => {
  assert(fs.existsSync('./sw.js'));
});

test('sw.js: handles install event', () => {
  const sw = fs.readFileSync('./sw.js', 'utf8');
  assert(sw.includes("'install'") || sw.includes('"install"'), 'install event handler required');
});

test('sw.js: handles activate event', () => {
  const sw = fs.readFileSync('./sw.js', 'utf8');
  assert(sw.includes("'activate'") || sw.includes('"activate"'), 'activate event handler required');
});

test('sw.js: handles fetch event', () => {
  const sw = fs.readFileSync('./sw.js', 'utf8');
  assert(sw.includes("'fetch'") || sw.includes('"fetch"'), 'fetch event handler required');
});

test('sw.js: calls skipWaiting', () => {
  const sw = fs.readFileSync('./sw.js', 'utf8');
  assert(sw.includes('skipWaiting'), 'skipWaiting required for immediate activation');
});

test('sw.js: defines a cache name constant', () => {
  const sw = fs.readFileSync('./sw.js', 'utf8');
  assert(sw.includes('perks-'), 'cache name should contain perks-');
});

// ─── Settings persistence ─────────────────────────────────────────────────────

console.log('\nSettings persistence');

test('saveApiKey: stores key in localStorage', () => {
  saveApiKey('sk-ant-test123');
  assertEqual(localStorage.getItem('perks_api_key'), 'sk-ant-test123');
});

test('saveApiKey: trims surrounding whitespace', () => {
  saveApiKey('  sk-ant-trimmed  ');
  assertEqual(localStorage.getItem('perks_api_key'), 'sk-ant-trimmed');
});

test('loadApiKey: returns the saved key', () => {
  saveApiKey('sk-ant-abc');
  assertEqual(loadApiKey(), 'sk-ant-abc');
});

test('loadApiKey: returns empty string when no key exists', () => {
  assertEqual(loadApiKey(), '');
});

test('clearApiKey: removes key from localStorage', () => {
  saveApiKey('sk-ant-abc');
  clearApiKey();
  assertEqual(localStorage.getItem('perks_api_key'), null);
});

test('clearApiKey: loadApiKey returns empty string after clear', () => {
  saveApiKey('sk-ant-abc');
  clearApiKey();
  assertEqual(loadApiKey(), '');
});

test('saveApiKey + loadApiKey: survives round-trip unchanged', () => {
  const key = 'sk-ant-api99-longkeyvalue1234567890';
  saveApiKey(key);
  assertEqual(loadApiKey(), key);
});

// ─── search and browse helpers ───────────────────────────────────────────────

console.log('\nSearch and browse helpers');

test('getAllMerchants: returns empty array when no data in storage', () => {
  assert(Array.isArray(getAllMerchants()) && getAllMerchants().length === 0);
});

test('getAllMerchants: returns 65 merchants after seed', () => {
  preseedIfEmpty();
  assertEqual(getAllMerchants().length, 65);
});

test('getAllMerchants: each item has a non-empty programName string', () => {
  preseedIfEmpty();
  for (const m of getAllMerchants()) {
    assert(typeof m.programName === 'string' && m.programName.length > 0, `Missing programName on ${m.id}`);
  }
});

test('getAllMerchants: programName matches the parent program display name', () => {
  preseedIfEmpty();
  const data = loadData();
  for (const [progId, prog] of Object.entries(data.programs)) {
    for (const m of getAllMerchants().filter(m => m.program === progId)) {
      assertEqual(m.programName, prog.name, `programName mismatch for ${m.id}`);
    }
  }
});

test('getAllMerchants: does not mutate stored merchant objects', () => {
  preseedIfEmpty();
  const stored = loadData().programs.rewardgateway.merchants[0];
  assert(!('programName' in stored), 'stored merchant should not have programName');
});

test('getCategoryList: returns empty array when no data', () => {
  const result = getCategoryList();
  assert(Array.isArray(result) && result.length === 0);
});

test('getCategoryList: returns non-empty array after seed', () => {
  preseedIfEmpty();
  assert(getCategoryList().length > 0);
});

test('getCategoryList: categories are sorted alphabetically', () => {
  preseedIfEmpty();
  const cats = getCategoryList();
  for (let i = 0; i < cats.length - 1; i++) {
    assert(cats[i] <= cats[i + 1], `Not sorted: "${cats[i]}" > "${cats[i + 1]}"`);
  }
});

test('getCategoryList: no duplicate categories', () => {
  preseedIfEmpty();
  const cats = getCategoryList();
  assertEqual(cats.length, new Set(cats).size, 'Duplicate categories found');
});

test('getMerchantsByCategory: returns empty array for unknown category', () => {
  preseedIfEmpty();
  const result = getMerchantsByCategory('__nonexistent__');
  assert(Array.isArray(result) && result.length === 0);
});

test('getMerchantsByCategory: returns only merchants matching the category', () => {
  preseedIfEmpty();
  const cat = getCategoryList()[0];
  const result = getMerchantsByCategory(cat);
  assert(result.length > 0, `Expected merchants in category "${cat}"`);
  for (const m of result) {
    assertEqual(m.category, cat, `Merchant ${m.id} has wrong category`);
  }
});

test('getMerchantsByCategory: returned merchants have programName field', () => {
  preseedIfEmpty();
  const cat = getCategoryList()[0];
  for (const m of getMerchantsByCategory(cat)) {
    assert(typeof m.programName === 'string' && m.programName.length > 0, `Missing programName on ${m.id}`);
  }
});

test('deep link: all seeded merchant deepLink fields are strings', () => {
  preseedIfEmpty();
  for (const m of getAllMerchants()) {
    assert(typeof m.deepLink === 'string', `deepLink on ${m.id} is not a string`);
  }
});

test('deep link: non-empty deepLinks start with http', () => {
  preseedIfEmpty();
  const data = loadData();
  data.programs.rewardgateway.merchants.push({
    id: 'test-deeplink', name: 'Test Store', program: 'rewardgateway', category: 'Test',
    discount: '5% off', description: 'A test merchant added to verify that non-empty deep link fields start with http.',
    deepLink: 'https://example.com/perks', addedAt: '2024-01-01T00:00:00.000Z',
  });
  saveData(data);
  const withLinks = getAllMerchants().filter(m => m.deepLink !== '');
  assert(withLinks.length > 0, 'Expected at least one merchant with a deepLink');
  for (const m of withLinks) {
    assert(m.deepLink.startsWith('http'), `deepLink should start with http: ${m.deepLink}`);
  }
});

// ─── AI Import: buildImportPayload ───────────────────────────────────────────

console.log('\nAI Import — buildImportPayload');

test('buildImportPayload: model is claude-sonnet-4-20250514', () => {
  const p = buildImportPayload('nrma', 'NRMA', 'some text');
  assertEqual(p.model, 'claude-sonnet-4-20250514');
});

test('buildImportPayload: max_tokens is 4096', () => {
  const p = buildImportPayload('nrma', 'NRMA', 'some text');
  assertEqual(p.max_tokens, 4096);
});

test('buildImportPayload: messages is array with one entry', () => {
  const p = buildImportPayload('nrma', 'NRMA', 'some text');
  assert(Array.isArray(p.messages) && p.messages.length === 1);
});

test('buildImportPayload: message role is user', () => {
  const p = buildImportPayload('nrma', 'NRMA', 'some text');
  assertEqual(p.messages[0].role, 'user');
});

test('buildImportPayload: prompt includes programId', () => {
  const p = buildImportPayload('shopback', 'ShopBack', 'some text');
  assert(p.messages[0].content.includes('shopback'), 'Prompt should contain programId');
});

test('buildImportPayload: prompt includes programName', () => {
  const p = buildImportPayload('shopback', 'ShopBack', 'some text');
  assert(p.messages[0].content.includes('ShopBack'), 'Prompt should contain programName');
});

test('buildImportPayload: prompt includes rawText', () => {
  const p = buildImportPayload('nrma', 'NRMA', 'Get 10% off at NRMA shops');
  assert(p.messages[0].content.includes('Get 10% off at NRMA shops'), 'Prompt should contain rawText');
});

// ─── AI Import: parseExtractedMerchants ──────────────────────────────────────

console.log('\nAI Import — parseExtractedMerchants');

const VALID_MERCHANT_NO_ADDEDAT = {
  id: 'test-store-nrma',
  name: 'Test Store',
  program: 'nrma',
  category: 'General Retail',
  discount: '10% off everything',
  description: 'Test Store is a fictional retailer used in unit tests. NRMA members receive 10% off all purchases.',
  deepLink: '',
};

test('parseExtractedMerchants: valid JSON array returns merchants', () => {
  const content = JSON.stringify([VALID_MERCHANT_NO_ADDEDAT]);
  const { merchants } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants.length, 1);
});

test('parseExtractedMerchants: forces program field to programId', () => {
  const wrongProgram = Object.assign({}, VALID_MERCHANT_NO_ADDEDAT, { program: 'wrong_id' });
  const content = JSON.stringify([wrongProgram]);
  const { merchants } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants[0].program, 'nrma');
});

test('parseExtractedMerchants: stamps addedAt as ISO 8601 string', () => {
  const content = JSON.stringify([VALID_MERCHANT_NO_ADDEDAT]);
  const { merchants } = parseExtractedMerchants(content, 'nrma');
  assert(typeof merchants[0].addedAt === 'string' && merchants[0].addedAt.includes('T'), 'addedAt should be ISO 8601');
});

test('parseExtractedMerchants: strips leading ```json fence', () => {
  const content = '```json\n' + JSON.stringify([VALID_MERCHANT_NO_ADDEDAT]) + '\n```';
  const { merchants } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants.length, 1);
});

test('parseExtractedMerchants: strips leading ``` fence (no lang tag)', () => {
  const content = '```\n' + JSON.stringify([VALID_MERCHANT_NO_ADDEDAT]) + '\n```';
  const { merchants } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants.length, 1);
});

test('parseExtractedMerchants: skips merchants with missing required fields', () => {
  const incomplete = { name: 'No ID', program: 'nrma', category: 'Retail' };
  const content = JSON.stringify([VALID_MERCHANT_NO_ADDEDAT, incomplete]);
  const { merchants, skipped } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants.length, 1);
  assertEqual(skipped, 1);
});

test('parseExtractedMerchants: all invalid → merchants empty, skipped > 0', () => {
  const incomplete = { name: 'Oops' };
  const content = JSON.stringify([incomplete]);
  const { merchants, skipped } = parseExtractedMerchants(content, 'nrma');
  assertEqual(merchants.length, 0);
  assertEqual(skipped, 1);
});

test('parseExtractedMerchants: throws on invalid JSON', () => {
  let threw = false;
  try { parseExtractedMerchants('not json at all', 'nrma'); } catch (e) { threw = true; }
  assert(threw, 'Should throw on invalid JSON');
});

test('parseExtractedMerchants: throws when response is not an array', () => {
  let threw = false;
  try { parseExtractedMerchants('{"foo":"bar"}', 'nrma'); } catch (e) { threw = true; }
  assert(threw, 'Should throw when response is an object not an array');
});

// ─── summary ─────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`  ${passed} passed  |  ${failed} failed`);
if (failed > 0) process.exit(1);
