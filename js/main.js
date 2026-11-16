import { Spectrum, SCREEN_W, SCREEN_H } from './spectrum.js';
import { tokenise, makeTap } from './basic.js';
import { EXAMPLES } from './examples.js';

const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const roms = {};
let machine = null;
let audio = null, nextAudioT = 0;

// ---------- ROMs ----------
async function fetchRom(name) {
  try {
    const r = await fetch(`roms/${name}`);
    if (!r.ok) return null;
    const b = new Uint8Array(await r.arrayBuffer());
    return b.length === 16384 ? b : null;
  } catch { return null; }
}
function romsFor(model) {
  if (model === '48') return roms['48.rom'] ? [roms['48.rom']] : null;
  return roms['128-0.rom'] && roms['128-1.rom'] ? [roms['128-0.rom'], roms['128-1.rom']] : null;
}

function startMachine(model) {
  const set = romsFor(model);
  $('rom-missing').hidden = !!set;
  if (!set) { machine = null; return; }
  machine = new Spectrum(model, set);
  if (audio) machine.sampleRate = audio.sampleRate;
  machine.onSave = (blocks, complete) => { if (complete) { $('save-tap').disabled = false; say('The Spectrum saved a program. Use "Download saved tape" to keep it.', 'ok'); } };
  $('save-tap').disabled = true;
  store.set('zx.model', model);
}

// ---------- display and timing ----------
const canvas = $('screen'), ctx = canvas.getContext('2d');
const image = ctx.createImageData(SCREEN_W, SCREEN_H);
const pixels = new Uint32Array(image.data.buffer);
let last = performance.now(), acc = 0;

function tick(now) {
  requestAnimationFrame(tick);
  acc = Math.min(acc + (now - last), 100);
  last = now;
  if (!machine) return;
  let ran = false;
  while (acc >= 20) {
    acc -= 20;
    machine.runFrame();
    playAudio(machine.audioFrame());
    releaseKeys();
    ran = true;
  }
  if (ran) { machine.render(pixels); ctx.putImageData(image, 0, 0); }
}

// ---------- sound ----------
function ensureAudio() {
  if (audio) { if (audio.state === 'suspended') audio.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audio = new AC();
  if (machine) machine.sampleRate = audio.sampleRate;
}
function playAudio(samples) {
  if (!audio || audio.state !== 'running' || !$('sound').checked || !samples.length) return;
  const now = audio.currentTime;
  if (nextAudioT < now + 0.02) nextAudioT = now + 0.06;
  if (nextAudioT > now + 0.3) return; // too far ahead; drop
  const buf = audio.createBuffer(1, samples.length, audio.sampleRate);
  buf.copyToChannel(samples, 0);
  const src = audio.createBufferSource();
  src.buffer = buf; src.connect(audio.destination); src.start(nextAudioT);
  nextAudioT += samples.length / audio.sampleRate;
}

// ---------- keyboard ----------
const SYMS = { '"': 'P', ',': 'N', '.': 'M', ';': 'O', ':': 'Z', '+': 'K', '-': 'J', '*': 'B', '/': 'V', '=': 'L', '<': 'R', '>': 'T',
  '(': '8', ')': '9', '?': 'C', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '&': '6', "'": '7', '_': '0', '^': 'H', '£': 'X' };
const SPECIAL = { Backspace: ['CAPS', '0'], ArrowLeft: ['CAPS', '5'], ArrowDown: ['CAPS', '6'], ArrowUp: ['CAPS', '7'], ArrowRight: ['CAPS', '8'],
  Escape: ['CAPS', 'SPACE'], Enter: ['ENTER'], ' ': ['SPACE'], Tab: ['CAPS', 'SYM'], Shift: ['CAPS'], Control: ['SYM'], Alt: ['SYM'] };
const held = new Map();

function mapKey(e) {
  if (!e.ctrlKey && !e.altKey && SYMS[e.key]) return { keys: ['SYM', SYMS[e.key]], noCaps: true };
  if (SPECIAL[e.key]) return { keys: SPECIAL[e.key] };
  let m = /^Key([A-Z])$/.exec(e.code);
  if (m) return { keys: [m[1]] };
  m = /^(?:Digit|Numpad)(\d)$/.exec(e.code);
  if (m) return { keys: [m[1]] };
  return null;
}
function syncKeys() {
  if (!machine) return;
  machine.releaseAllKeys();
  const noCaps = [...held.values()].some(h => h.noCaps);
  for (const h of held.values()) {
    if (noCaps && h.keys.length === 1 && h.keys[0] === 'CAPS') continue;
    for (const k of h.keys) machine.setKey(k, true);
  }
}
const wrap = $('screen-wrap');
wrap.addEventListener('keydown', e => {
  if (e.metaKey) return;
  const m = mapKey(e);
  if (!m) return;
  e.preventDefault();
  ensureAudio();
  if (e.repeat && held.has(e.code || e.key)) { held.get(e.code || e.key).released = false; return; }
  m.downFrame = machine ? machine.frame : 0;
  held.set(e.code || e.key, m);
  syncKeys();
});
// A released key stays down until the Spectrum has run three frames with it, so a quick tap is never missed.
wrap.addEventListener('keyup', e => {
  const m = held.get(e.code || e.key);
  if (m) { m.released = true; releaseKeys(); }
});
function releaseKeys() {
  let changed = false;
  for (const [id, m] of held) {
    if (m.released && (!machine || machine.frame - m.downFrame >= 3)) { held.delete(id); changed = true; }
  }
  if (changed) syncKeys();
}
wrap.addEventListener('blur', () => { held.clear(); syncKeys(); $('focus-hint').className = ''; $('focus-hint').textContent = 'Click the screen to type on the Spectrum.'; });
wrap.addEventListener('focus', () => { $('focus-hint').className = 'on'; $('focus-hint').textContent = 'Typing goes to the Spectrum.'; });
wrap.addEventListener('pointerdown', ensureAudio);

// On-screen keyboard: [key, label, keyword, symbol]
const LAYOUT = [
  ['1', '1', 'EDIT', '!'], ['2', '2', 'CAPS LK', '@'], ['3', '3', 'TRUE V', '#'], ['4', '4', 'INV V', '$'], ['5', '5', '←', '%'],
  ['6', '6', '↓', '&'], ['7', '7', '↑', "'"], ['8', '8', '→', '('], ['9', '9', 'GRAPH', ')'], ['0', '0', 'DELETE', '_'],
  ['Q', 'Q', 'PLOT', '<='], ['W', 'W', 'DRAW', '<>'], ['E', 'E', 'REM', '>='], ['R', 'R', 'RUN', '<'], ['T', 'T', 'RAND', '>'],
  ['Y', 'Y', 'RETURN', 'AND'], ['U', 'U', 'IF', 'OR'], ['I', 'I', 'INPUT', 'AT'], ['O', 'O', 'POKE', ';'], ['P', 'P', 'PRINT', '"'],
  ['A', 'A', 'NEW', 'STOP'], ['S', 'S', 'SAVE', 'NOT'], ['D', 'D', 'DIM', 'STEP'], ['F', 'F', 'FOR', 'TO'], ['G', 'G', 'GO TO', 'THEN'],
  ['H', 'H', 'GO SUB', '↑'], ['J', 'J', 'LOAD', '-'], ['K', 'K', 'LIST', '+'], ['L', 'L', 'LET', '='], ['ENTER', '⏎', 'ENTER', ''],
  ['CAPS', '⇧', 'CAPS SHIFT', ''], ['Z', 'Z', 'COPY', ':'], ['X', 'X', 'CLEAR', '£'], ['C', 'C', 'CONT', '?'], ['V', 'V', 'CLS', '/'],
  ['B', 'B', 'BORDER', '*'], ['N', 'N', 'NEXT', ','], ['M', 'M', 'PAUSE', '.'], ['SYM', 'SS', 'SYMBOL', ''], ['SPACE', '␣', 'BREAK', ''],
];
const latched = new Set();
for (const [key, label, word, sym] of LAYOUT) {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = `<em></em><b></b><small></small>`;
  b.children[0].textContent = sym; b.children[1].textContent = label; b.children[2].textContent = word;
  b.addEventListener('click', () => {
    ensureAudio();
    if (!machine) return;
    if (key === 'CAPS' || key === 'SYM') {
      if (latched.has(key)) latched.delete(key); else latched.add(key);
      b.classList.toggle('latched', latched.has(key));
      return;
    }
    machine.typeKeys([[...latched, key]], 5, 2);
    latched.clear();
    document.querySelectorAll('#keyboard .latched').forEach(el => el.classList.remove('latched'));
  });
  $('keyboard').appendChild(b);
}

// ---------- editor ----------
const code = $('code');
function say(text, kind = '') { $('message').textContent = text; $('message').className = kind; }

function run() {
  ensureAudio();
  if (!machine) { say('The Spectrum cannot start without its ROM files.', 'error'); return; }
  const { bytes, firstLine, errors } = tokenise(code.value);
  if (errors.length) { say(errors.join(' '), 'error'); return; }
  const ok = machine.loadAndRun(makeTap(bytes, 'program', firstLine));
  say(ok ? 'Program sent to the Spectrum and started.' : 'The Spectrum did not accept the program. Press Reset and try again.', ok ? 'ok' : 'error');
  wrap.focus();
}
$('run').addEventListener('click', run);
code.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
code.addEventListener('input', () => store.set('zx.program', code.value));

for (const [i, ex] of EXAMPLES.entries()) $('examples').add(new Option(ex.name, String(i)));
$('examples').addEventListener('change', e => {
  const ex = EXAMPLES[e.target.value];
  e.target.value = '';
  if (!ex) return;
  if (code.value.trim() && code.value !== ex.code && !confirm('Replace the program in the editor with this example?')) return;
  code.value = ex.code;
  store.set('zx.program', code.value);
  say(`Loaded the "${ex.name}" example. Press Run to start it.`);
});

function download(name, data, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('save-bas').addEventListener('click', () => download('program.bas', code.value, 'text/plain'));
$('open-bas').addEventListener('click', () => $('bas-file').click());
$('bas-file').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f) return;
  code.value = await f.text();
  store.set('zx.program', code.value);
  e.target.value = '';
  say(`Opened ${f.name}.`);
});

// ---------- machine controls ----------
$('reset').addEventListener('click', () => { if (machine) { machine.reset(); wrap.focus(); } });
$('break').addEventListener('click', () => { if (machine) { machine.typeKeys([['CAPS', 'SPACE']], 6, 2); wrap.focus(); } });
$('model').addEventListener('change', e => { startMachine(e.target.value); say(`Switched to the ${e.target.value}K Spectrum.`); });
$('open-tap').addEventListener('click', () => $('tap-file').click());
$('tap-file').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f || !machine) return;
  machine.setTape(new Uint8Array(await f.arrayBuffer()));
  e.target.value = '';
  say(`Tape "${f.name}" inserted. On the Spectrum type LOAD "" (48K: press J, then " twice, then Enter).`);
  wrap.focus();
});
$('save-tap').addEventListener('click', () => { if (machine) download('saved.tap', machine.savedTap(), 'application/octet-stream'); });
$('rom-files').addEventListener('change', async e => {
  for (const f of e.target.files) {
    const b = new Uint8Array(await f.arrayBuffer());
    if (b.length === 16384) roms[f.name.toLowerCase()] = b;
    else if (b.length === 32768) { roms['128-0.rom'] = b.subarray(0, 16384); roms['128-1.rom'] = b.subarray(16384); }
  }
  startMachine($('model').value);
});

// ---------- start ----------
code.value = store.get('zx.program') ?? EXAMPLES[0].code;
const wanted = store.get('zx.model') === '128' ? '128' : '48';
$('model').value = wanted;
for (const name of ['48.rom', '128-0.rom', '128-1.rom']) { const r = await fetchRom(name); if (r) roms[name] = r; }
startMachine(wanted);
if (new URLSearchParams(location.search).has('debug')) window.zx = { get machine() { return machine; } };
requestAnimationFrame(tick);
