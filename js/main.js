import { Spectrum, SCREEN_W, SCREEN_H } from './spectrum.js?v=10';
import { tokenise, makeTap } from './basic.js?v=10';
import { EXAMPLES } from './examples.js?v=10';
import { LESSONS } from './tutorial.js?v=10';
import { STR } from './i18n.js?v=10';
import { explainLine } from './explain.js?v=10';

const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const roms = {};
let machine = null;
let audio = null, nextAudioT = 0;

// ---------- language ----------
let lang = store.get('zx.lang') || ((navigator.language || '').toLowerCase().startsWith('ka') ? 'ka' : 'en');
if (!STR[lang]) lang = 'en';
function t(key, params = {}) {
  let s = STR[lang][key] ?? STR.en[key] ?? key;
  for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
  return s;
}
const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let lastMessage = null;
function say(key, kind = '', params = {}) {
  lastMessage = key ? { key, kind, params } : null;
  $('message').textContent = key ? t(key, params) : '';
  $('message').className = kind;
}
function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  $('lang').textContent = t('langButton');
  const ex = $('examples');
  ex.length = 0;
  ex.add(new Option(t('examples'), ''));
  STR[lang].exampleNames.forEach((name, i) => ex.add(new Option(name, String(i))));
  const ls = $('lesson-select');
  ls.length = 0;
  LESSONS.forEach((l, i) => ls.add(new Option(l.title[lang], String(i))));
  showLesson(lesson);
  explainEditor(editorLine);
  setFocusHint(document.activeElement === wrap);
  if (lastMessage) say(lastMessage.key, lastMessage.kind, lastMessage.params);
}
$('lang').addEventListener('click', () => { lang = lang === 'en' ? 'ka' : 'en'; store.set('zx.lang', lang); applyLanguage(); });

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
  machine.onSave = (blocks, complete) => { if (complete) { $('save-tap').disabled = false; say('msgSaved', 'ok'); } };
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
function setFocusHint(on) { $('focus-hint').className = on ? 'on' : ''; $('focus-hint').textContent = t(on ? 'hintOn' : 'hintOff'); }
wrap.addEventListener('keydown', e => {
  if (e.metaKey) return;
  const m = mapKey(e);
  if (!m) return;
  e.preventDefault();
  ensureAudio();
  const id = e.code || e.key;
  if (e.repeat && held.has(id)) { held.get(id).released = false; return; }
  m.downFrame = machine ? machine.frame : 0;
  held.set(id, m);
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
wrap.addEventListener('blur', () => { held.clear(); syncKeys(); setFocusHint(false); });
wrap.addEventListener('focus', () => setFocusHint(true));
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

// Sends the editor's program to the Spectrum. Returns true when it was accepted.
function run() {
  ensureAudio();
  if (!machine) { say('msgNoRom', 'error'); return false; }
  const { bytes, firstLine, errors } = tokenise(code.value);
  if (errors.length) { say(errors[0].key, 'error', errors[0]); return false; }
  held.clear();
  const list = $('show-listing').checked;
  const ok = machine.loadAndRun(makeTap(bytes, 'program', list ? -1 : firstLine), list);
  say(ok ? 'msgStarted' : 'msgRejected', ok ? 'ok' : 'error');
  if (ok) wrap.focus({ preventScroll: true });
  return ok;
}
$('run').addEventListener('click', run);
$('show-listing').checked = store.get('zx.listing') !== '0';
$('show-listing').addEventListener('change', e => store.set('zx.listing', e.target.checked ? '1' : '0'));
code.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
code.addEventListener('input', () => store.set('zx.program', code.value));

// Typing into the editor through execCommand keeps the browser's undo history working.
function editorInsert(text, from, to) {
  code.setSelectionRange(from, to);
  const done = text ? document.execCommand('insertText', false, text) : document.execCommand('delete');
  if (!done) code.setRangeText(text, from, to, 'end');
  store.set('zx.program', code.value);
}
// Enter at the end of a numbered line starts the next line with the next number.
code.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.isComposing) return;
  const v = code.value, pos = code.selectionStart;
  if (pos !== code.selectionEnd) return;
  const ls = v.lastIndexOf('\n', pos - 1) + 1;
  let le = v.indexOf('\n', pos);
  if (le < 0) le = v.length;
  if (v.slice(pos, le).trim()) return; // cursor in the middle of a line: ordinary new line
  const m = /^\s*(\d+)\s*(.*)$/.exec(v.slice(ls, le));
  if (!m) return;
  e.preventDefault();
  if (!m[2]) { editorInsert('', ls, le); return; } // a number with nothing after it: take it away
  const n = Number(m[1]), following = /^\s*(\d+)/.exec(v.slice(le + 1));
  let next = n + 10;
  if (following && next >= Number(following[1])) next = Math.floor((n + Number(following[1])) / 2);
  editorInsert(next > n && next <= 9999 ? `\n${next} ` : '\n', le, le);
});
code.addEventListener('focus', () => { if (!code.value.trim()) { code.value = '10 '; code.setSelectionRange(3, 3); } });

// Puts a ready-made program in the editor and runs it, keeping the student's own program recoverable.
function useProgram(text, name) {
  const mine = code.value;
  if (mine.trim() && mine !== text) { store.set('zx.backup', mine); $('restore').hidden = false; }
  code.value = text;
  store.set('zx.program', text);
  explainEditor(-1);
  if (run()) say('msgRunning', 'ok', { name });
}
$('examples').addEventListener('change', e => {
  const i = e.target.value;
  e.target.value = '';
  if (EXAMPLES[i]) useProgram(EXAMPLES[i].code, STR[lang].exampleNames[i]);
});
$('restore').addEventListener('click', () => {
  const b = store.get('zx.backup');
  if (b == null) return;
  code.value = b;
  store.set('zx.program', b);
  $('restore').hidden = true;
  showTab('program');
  say('msgRestored');
});

function showTab(name) {
  for (const tab of ['program', 'learn']) {
    $('panel-' + tab).hidden = tab !== name;
    $('tab-' + tab).setAttribute('aria-selected', String(tab === name));
  }
  store.set('zx.tab', name);
}
$('tab-program').addEventListener('click', () => showTab('program'));
$('tab-learn').addEventListener('click', () => showTab('learn'));

// ---------- lessons ----------
let lesson = Math.min(LESSONS.length - 1, Math.max(0, Number(store.get('zx.lesson')) || 0));
const lessonCode = l => l.lines.map(x => x[0]).join('\n') + '\n';

const explainOn = () => store.get('zx.explain') !== '0';
// Table with every item on the line (keyword, values, punctuation) and what each one means.
function piecesHtml(result) {
  if (!result || !result.pieces.length) return '';
  const rows = result.pieces.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('');
  return `<div class="pieces-title">${escapeHtml(t('piecesTitle'))}</div><table class="pieces">${rows}</table>`;
}
// Pointing at a line explains it. Once an explanation is showing, another line replaces it only after the
// mouse rests on that line for a moment, so the student can move down to the explanation and scroll
// without it changing. Scrolling the page under a still mouse changes nothing either.
const HOVER_REST = 450;
let hoverTimer = 0, lastX = -1, lastY = -1;
const mouseMoved = e => e.clientX !== lastX || e.clientY !== lastY;
document.addEventListener('pointermove', e => { lastX = e.clientX; lastY = e.clientY; });
function hover(showing, show) {
  clearTimeout(hoverTimer);
  if (showing) hoverTimer = setTimeout(show, HOVER_REST); else show();
}
function setExplanation(box, html) {
  if (box.dataset.html !== html) { box.innerHTML = html; box.dataset.html = html; box.scrollTop = 0; }
  box.className = 'explain';
}
function clearExplanation(box, text) {
  box.textContent = text; box.dataset.html = ''; box.className = 'explain idle';
}
let lessonRow = null;
function explain(row) {
  clearTimeout(hoverTimer);
  lessonRow = row;
  const on = explainOn();
  document.querySelectorAll('#lesson-code .code-line').forEach(el => el.classList.toggle('active', on && el === row));
  const box = $('explain');
  if (!on) return clearExplanation(box, t('explainOff'));
  if (!row) return clearExplanation(box, t('explainHint'));
  const line = LESSONS[lesson].lines[Number(row.dataset.index)];
  const num = /^\d+/.exec(line[0])[0];
  setExplanation(box, `<strong>${escapeHtml(t('lineLabel', { n: num }))}:</strong> ${escapeHtml(line[lang === 'ka' ? 2 : 1])}${piecesHtml(explainLine(line[0], lang))}`);
}
function showLesson(i) {
  lesson = Math.min(LESSONS.length - 1, Math.max(0, i));
  const l = LESSONS[lesson];
  $('lesson-title').textContent = l.title[lang];
  $('lesson-text').innerHTML = l.text[lang];
  const box = $('lesson-code');
  box.textContent = '';
  l.lines.forEach((line, k) => {
    const row = document.createElement('div');
    row.className = 'code-line';
    row.tabIndex = 0;
    row.dataset.index = String(k);
    row.textContent = line[0];
    for (const ev of ['focus', 'click']) row.addEventListener(ev, () => explain(row));
    row.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && mouseMoved(e) && row !== lessonRow) hover(lessonRow && explainOn(), () => explain(row)); });
    row.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
    box.appendChild(row);
  });
  explain(null);
  $('lesson-select').value = String(lesson);
  $('lesson-prev').disabled = lesson === 0;
  $('lesson-next').disabled = lesson === LESSONS.length - 1;
  store.set('zx.lesson', String(lesson));
}
$('lesson-select').addEventListener('change', e => showLesson(Number(e.target.value)));
$('lesson-prev').addEventListener('click', () => showLesson(lesson - 1));
$('lesson-next').addEventListener('click', () => showLesson(lesson + 1));
$('lesson-try').addEventListener('click', () => useProgram(lessonCode(LESSONS[lesson]), LESSONS[lesson].title[lang]));
const toggles = document.querySelectorAll('.explain-toggle');
toggles.forEach(box => {
  box.checked = explainOn();
  box.addEventListener('change', () => {
    store.set('zx.explain', box.checked ? '1' : '0');
    toggles.forEach(other => { other.checked = box.checked; });
    explain(null);
    explainEditor(editorLine);
  });
});

// ---------- explanations for the program in the editor ----------
let editorLine = -1;
function explainEditor(index) {
  editorLine = index;
  const box = $('explain-editor'), mark = $('code-mark');
  const text = index >= 0 ? code.value.split('\n')[index] : undefined;
  const result = explainOn() && text !== undefined ? explainLine(text, lang) : null;
  if (!result) {
    mark.hidden = true;
    editorLine = -1;
    return clearExplanation(box, t(explainOn() ? 'explainEditorHint' : 'explainOff'));
  }
  const cs = getComputedStyle(code), lh = parseFloat(cs.lineHeight);
  const top = code.offsetTop + code.clientTop + parseFloat(cs.paddingTop) + index * lh - code.scrollTop;
  mark.hidden = top < code.offsetTop || top + lh > code.offsetTop + code.offsetHeight;
  mark.style.top = `${top}px`;
  mark.style.height = `${lh}px`;
  const head = result.num ? `<strong>${escapeHtml(t('lineLabel', { n: result.num }))}:</strong> ` : '';
  setExplanation(box, (result.parts.length === 1 ? head + result.parts[0] : `${head}<ol>${result.parts.map(p => `<li>${p}</li>`).join('')}</ol>`) + piecesHtml(result));
}
function lineAtPointer(e) {
  const cs = getComputedStyle(code);
  const y = e.clientY - code.getBoundingClientRect().top - code.clientTop - parseFloat(cs.paddingTop) + code.scrollTop;
  const index = Math.floor(y / parseFloat(cs.lineHeight));
  return index >= 0 && index < code.value.split('\n').length ? index : -1;
}
const caretLine = () => code.value.slice(0, code.selectionStart).split('\n').length - 1;
let hoverLine = -1;
code.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || !mouseMoved(e) || !explainOn()) return;
  const i = lineAtPointer(e);
  if (i === hoverLine) return;
  hoverLine = i;
  clearTimeout(hoverTimer);
  // Empty rows and the space below the program leave the current explanation alone.
  if (i >= 0 && i !== editorLine && code.value.split('\n')[i].trim()) hover(editorLine >= 0, () => explainEditor(i));
});
code.addEventListener('pointerleave', () => { hoverLine = -1; clearTimeout(hoverTimer); });
for (const ev of ['keyup', 'click', 'input']) code.addEventListener(ev, () => { clearTimeout(hoverTimer); explainEditor(caretLine()); });
code.addEventListener('scroll', () => explainEditor(editorLine));

// ---------- files ----------
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
  say('msgOpened', '', { name: f.name });
});

// ---------- machine controls ----------
$('reset').addEventListener('click', () => { if (machine) { machine.reset(); wrap.focus({ preventScroll: true }); } });
$('break').addEventListener('click', () => { if (machine) { machine.keyQueue.length = 0; machine.typeKeys([['CAPS', 'SPACE']], 6, 2); wrap.focus({ preventScroll: true }); } });
$('model').addEventListener('change', e => { startMachine(e.target.value); say('msgSwitched', '', { model: e.target.value }); });
$('open-tap').addEventListener('click', () => $('tap-file').click());
$('tap-file').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f || !machine) return;
  machine.setTape(new Uint8Array(await f.arrayBuffer()));
  e.target.value = '';
  say('msgTape', '', { name: f.name });
  wrap.focus({ preventScroll: true });
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
$('restore').hidden = store.get('zx.backup') == null;
showTab(store.get('zx.tab') === 'learn' ? 'learn' : 'program');
applyLanguage();
const wanted = store.get('zx.model') === '128' ? '128' : '48';
$('model').value = wanted;
for (const name of ['48.rom', '128-0.rom', '128-1.rom']) { const r = await fetchRom(name); if (r) roms[name] = r; }
startMachine(wanted);
if (new URLSearchParams(location.search).has('debug')) window.zx = { get machine() { return machine; } };
requestAnimationFrame(tick);
