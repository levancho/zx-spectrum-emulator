// Converts plain-text Sinclair BASIC into the tokenised form the Spectrum ROM stores,
// and wraps it in a .tap tape image so the machine can LOAD it.

const KEYWORDS = ['RND', 'INKEY$', 'PI', 'FN', 'POINT', 'SCREEN$', 'ATTR', 'AT', 'TAB', 'VAL$', 'CODE', 'VAL', 'LEN',
  'SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN', 'LN', 'EXP', 'INT', 'SQR', 'SGN', 'ABS', 'PEEK', 'IN', 'USR', 'STR$',
  'CHR$', 'NOT', 'BIN', 'OR', 'AND', '<=', '>=', '<>', 'LINE', 'THEN', 'TO', 'STEP', 'DEF FN', 'CAT', 'FORMAT',
  'MOVE', 'ERASE', 'OPEN #', 'CLOSE #', 'MERGE', 'VERIFY', 'BEEP', 'CIRCLE', 'INK', 'PAPER', 'FLASH', 'BRIGHT',
  'INVERSE', 'OVER', 'OUT', 'LPRINT', 'LLIST', 'STOP', 'READ', 'DATA', 'RESTORE', 'NEW', 'BORDER', 'CONTINUE',
  'DIM', 'REM', 'FOR', 'GO TO', 'GO SUB', 'INPUT', 'LOAD', 'LIST', 'LET', 'PAUSE', 'NEXT', 'POKE', 'PRINT', 'PLOT',
  'RUN', 'SAVE', 'RANDOMIZE', 'IF', 'CLS', 'DRAW', 'CLEAR', 'RETURN', 'COPY'];

const T_BIN = 0xc4, T_DEFFN = 0xce, T_REM = 0xea;

// Word keywords, longest first, each as a regex anchored at the current position.
const WORD_MATCHERS = KEYWORDS
  .map((k, i) => ({ k, code: 0xa5 + i }))
  .filter(({ k }) => /^[A-Z]/.test(k))
  .sort((a, b) => b.k.length - a.k.length)
  .map(({ k, code }) => {
    const src = k.replace(/[$#]/g, '\\$&').replace(/ /g, '\\s*');
    const tail = /[A-Z]$/.test(k) ? '(?![A-Za-z0-9$])' : '';
    return { code, re: new RegExp('^' + src + tail, 'i') };
  });

const NUM_RE = /^(\d+\.?\d*|\.\d+)(E[+-]?\d+)?/i;

// The ROM's 5-byte number format.
function numberBytes(v) {
  if (Number.isInteger(v) && v >= 0 && v <= 65535) return [0, 0, v & 255, v >> 8, 0];
  if (v === 0 || !isFinite(v)) return [0, 0, 0, 0, 0];
  let e = Math.floor(Math.log2(v)) + 1;
  let m = v / Math.pow(2, e);
  if (m >= 1) { m /= 2; e++; }
  if (m < 0.5) { m *= 2; e--; }
  let mant = Math.round(m * 4294967296);
  if (mant >= 4294967296) { mant = 2147483648; e++; }
  if (e > 127 || e < -127) return [0, 0, 0, 0, 0];
  return [e + 128, Math.floor(mant / 16777216) & 0x7f, Math.floor(mant / 65536) & 255, Math.floor(mant / 256) & 255, mant & 255];
}

function charCode(ch) {
  if (ch === '£') return 0x60;
  if (ch === '©') return 0x7f;
  const c = ch.charCodeAt(0);
  return c >= 32 && c < 127 ? c : 0x3f;
}

function tokeniseLine(text) {
  const out = [];
  let i = 0, inDefFn = false;
  const trimSpaces = () => { while (out.length && out[out.length - 1] === 32) out.pop(); };
  const skipSpaces = () => { while (text[i] === ' ') i++; };
  while (i < text.length) {
    const ch = text[i], rest = text.slice(i);
    if (ch === '"') {
      const end = text.indexOf('"', i + 1);
      const stop = end < 0 ? text.length : end + 1;
      for (; i < stop; i++) out.push(charCode(text[i]));
      continue;
    }
    const sym = rest.startsWith('<=') ? 0xc7 : rest.startsWith('>=') ? 0xc8 : rest.startsWith('<>') ? 0xc9 : 0;
    if (sym) { out.push(sym); i += 2; continue; }
    if (/[A-Za-z]/.test(ch)) {
      let code = 0, len = 0;
      const alias = /^(GOTO|GOSUB)(?![A-Za-z0-9$])/i.exec(rest);
      if (alias) { code = alias[1].length === 4 ? 0xec : 0xed; len = alias[0].length; }
      else for (const { code: c, re } of WORD_MATCHERS) {
        const mm = re.exec(rest);
        if (mm) { code = c; len = mm[0].length; break; }
      }
      if (code) {
        trimSpaces();
        out.push(code);
        i += len;
        if (code === T_REM) {
          if (text[i] === ' ') i++;
          for (; i < text.length; i++) out.push(charCode(text[i]));
          break;
        }
        skipSpaces();
        if (code === T_DEFFN) inDefFn = true;
        if (code === T_BIN) {
          const b = /^[01]+/.exec(text.slice(i));
          if (b) {
            for (const d of b[0]) out.push(d.charCodeAt(0));
            out.push(0x0e, ...numberBytes(parseInt(b[0], 2) & 0xffff));
            i += b[0].length;
          }
        }
        continue;
      }
      // An identifier: copy the whole run so keywords inside names are left alone.
      const id = /^[A-Za-z][A-Za-z0-9]*/.exec(rest)[0];
      for (const c of id) out.push(c.charCodeAt(0));
      i += id.length;
      continue;
    }
    const num = /[0-9.]/.test(ch) && NUM_RE.exec(rest);
    if (num) {
      for (const c of num[0].toUpperCase()) out.push(c.charCodeAt(0));
      out.push(0x0e, ...numberBytes(parseFloat(num[0])));
      i += num[0].length;
      continue;
    }
    if (inDefFn) {
      // The ROM keeps a hidden 5-byte slot after each DEF FN parameter.
      const prev = out[out.length - 1];
      if ((ch === ',' || ch === ')') && (prev === 0x24 || (prev >= 0x41 && prev <= 0x7a))) out.push(0x0e, 0, 0, 0, 0, 0);
      if (ch === '=' || ch === ':') inDefFn = false;
    }
    out.push(charCode(ch));
    i++;
  }
  return out;
}

// Returns { bytes: Uint8Array, firstLine, errors: [string] }
export function tokenise(source) {
  const lines = new Map();
  const errors = [];
  let last = 0;
  source.split(/\r?\n/).forEach((raw, idx) => {
    if (!raw.trim()) return;
    const m = /^\s*(\d+)\s?(.*)$/.exec(raw);
    let n, body;
    if (m) { n = parseInt(m[1], 10); body = m[2]; } else { n = last + 10; body = raw.trim(); }
    if (n < 1 || n > 9999) { errors.push(`Row ${idx + 1}: line numbers must be between 1 and 9999.`); return; }
    last = n;
    lines.set(n, body.replace(/\s+$/, ''));
  });
  const out = [];
  const sorted = [...lines.keys()].sort((a, b) => a - b);
  for (const n of sorted) {
    const body = tokeniseLine(lines.get(n));
    body.push(0x0d);
    out.push(n >> 8, n & 255, body.length & 255, body.length >> 8, ...body);
  }
  if (!sorted.length) errors.push('There is no program to run yet.');
  return { bytes: Uint8Array.from(out), firstLine: sorted[0] ?? 0, errors };
}

function tapBlock(flag, data) {
  const blk = new Uint8Array(data.length + 4);
  blk[0] = (data.length + 2) & 255; blk[1] = (data.length + 2) >> 8;
  blk[2] = flag;
  blk.set(data, 3);
  let x = flag;
  for (const b of data) x ^= b;
  blk[blk.length - 1] = x;
  return blk;
}

// Builds a .tap image holding one BASIC program. autostart: line to run, or -1 for none.
export function makeTap(program, name = 'program', autostart = -1) {
  const hdr = new Uint8Array(17);
  hdr[0] = 0;
  const nm = (name + '          ').slice(0, 10);
  for (let i = 0; i < 10; i++) hdr[1 + i] = charCode(nm[i]);
  const len = program.length, auto = autostart < 0 ? 0x8000 : autostart;
  hdr[11] = len & 255; hdr[12] = len >> 8;
  hdr[13] = auto & 255; hdr[14] = auto >> 8;
  hdr[15] = len & 255; hdr[16] = len >> 8;
  const a = tapBlock(0x00, hdr), b = tapBlock(0xff, program);
  const tap = new Uint8Array(a.length + b.length);
  tap.set(a); tap.set(b, a.length);
  return tap;
}
