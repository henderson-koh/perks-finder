// Patches index.html in-place: replaces the inline Fuse.js block with the
// current version from node_modules. Run: node generate-index.js
const fs = require('fs');

const fuseSource = fs.readFileSync('./node_modules/fuse.js/dist/fuse.min.cjs', 'utf8').trim();
const html       = fs.readFileSync('./index.html', 'utf8');

const FUSE_START = 'var Fuse = (function() {\n  var module = { exports: {} };';
const FUSE_END   = '  return module.exports;\n})();';

const startIdx = html.indexOf(FUSE_START);
const endIdx   = html.indexOf(FUSE_END) + FUSE_END.length;

if (startIdx === -1 || endIdx < FUSE_END.length) {
  console.error('ERROR: Could not locate Fuse.js inline block in index.html');
  process.exit(1);
}

const patched =
  html.slice(0, startIdx) +
  'var Fuse = (function() {\n  var module = { exports: {} };\n  ' +
  fuseSource +
  '\n  return module.exports;\n})();' +
  html.slice(endIdx);

fs.writeFileSync('./index.html', patched, 'utf8');
console.log('Written index.html —', patched.length, 'bytes');
