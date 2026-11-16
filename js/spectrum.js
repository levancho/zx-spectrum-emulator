// ZX Spectrum 48K and 128K machine: memory, paging, screen, keyboard, beeper, AY sound and tape.
import { Z80 } from './z80.js';

const KEY_ROWS = ['CAPS Z X C V', 'A S D F G', 'Q W E R T', '1 2 3 4 5', '0 9 8 7 6', 'P O I U Y', 'ENTER L K J H', 'SPACE SYM M N B'];
export const KEYS = {};
KEY_ROWS.forEach((r, i) => r.split(' ').forEach((k, b) => { KEYS[k] = [i, 1 << b]; }));

export const SCREEN_W = 320, SCREEN_H = 240;
const BORDER_L = 32, BORDER_T = 24;

const PALETTE = new Uint32Array(16);
for (let i = 0; i < 16; i++) {
  const lv = i & 8 ? 0xff : 0xd8;
  PALETTE[i] = 0xff000000 | ((i & 1 ? lv : 0) << 16) | ((i & 4 ? lv : 0) << 8) | (i & 2 ? lv : 0);
}

const AY_VOL = [0, 0.0137, 0.0205, 0.0291, 0.0423, 0.0618, 0.0847, 0.1369, 0.1691, 0.2647, 0.3527, 0.4499, 0.5704, 0.6873, 0.8482, 1];
const AY_MASK = [0xff, 0x0f, 0xff, 0x0f, 0xff, 0x0f, 0x1f, 0xff, 0x1f, 0x1f, 0x1f, 0xff, 0xff, 0x0f, 0xff, 0xff];

// AY-3-8912 sound chip (128K).
class AY {
  constructor(clock) { this.clock = clock; this.reset(); }
  reset() {
    this.reg = new Uint8Array(16); this.sel = 0;
    this.cnt = [0, 0, 0]; this.out = [0, 0, 0];
    this.ncnt = 0; this.rng = 1;
    this.ecnt = 0; this.estep = 0; this.ehold = false; this.eatt = false; this.evol = 0;
    this.frac = 0;
  }
  read() { return this.reg[this.sel]; }
  write(v) {
    const r = this.sel;
    this.reg[r] = v & AY_MASK[r];
    if (r === 13) { this.estep = 0; this.ecnt = 0; this.ehold = false; this.eatt = !!(v & 4); this.evol = this.eatt ? 0 : 15; }
  }
  tick() {
    const R = this.reg;
    for (let c = 0; c < 3; c++) {
      const p = (R[c * 2] | (R[c * 2 + 1] << 8)) || 1;
      if (++this.cnt[c] >= p) { this.cnt[c] = 0; this.out[c] ^= 1; }
    }
    if (++this.ncnt >= (R[6] || 1) * 2) {
      this.ncnt = 0;
      const bit = (this.rng ^ (this.rng >> 3)) & 1;
      this.rng = (this.rng >> 1) | (bit << 16);
    }
    if (!this.ehold && ++this.ecnt >= ((R[11] | (R[12] << 8)) || 1) * 2) {
      this.ecnt = 0;
      if (++this.estep > 15) {
        const shape = R[13];
        if (!(shape & 8)) { this.ehold = true; this.evol = 0; }
        else if (shape & 1) { this.ehold = true; const a0 = !!(shape & 4); this.evol = ((shape & 2) ? !a0 : a0) ? 15 : 0; }
        else { if (shape & 2) this.eatt = !this.eatt; this.estep = 0; this.evol = this.eatt ? 0 : 15; }
      } else this.evol = this.eatt ? this.estep : 15 - this.estep;
    }
  }
  level() {
    const R = this.reg, mix = R[7], n = this.rng & 1;
    let s = 0;
    for (let c = 0; c < 3; c++) {
      if ((this.out[c] | ((mix >> c) & 1)) & (n | ((mix >> (c + 3)) & 1))) {
        const a = R[8 + c];
        s += AY_VOL[a & 16 ? this.evol : a & 15];
      }
    }
    return s;
  }
  render(out, rate) {
    const tps = this.clock / 8 / rate;
    for (let i = 0; i < out.length; i++) {
      this.frac += tps;
      let acc = 0, k = 0;
      while (this.frac >= 1) { this.tick(); acc += this.level(); k++; this.frac--; }
      out[i] += (k ? acc / k : this.level()) * 0.2;
    }
  }
}

export class Spectrum {
  // model: '48' or '128'. roms: [48.rom] or [128-0.rom, 128-1.rom]
  constructor(model, roms) {
    this.is128 = model === '128';
    this.model = model;
    this.roms = roms;
    this.fontRom = roms[roms.length - 1];
    this.frameT = this.is128 ? 70908 : 69888;
    this.lineT = this.is128 ? 228 : 224;
    this.paperT = this.is128 ? 14362 : 14336; // T-state of the first paper pixel
    this.cpuHz = this.is128 ? 3546900 : 3500000;
    this.ram = Array.from({ length: 8 }, () => new Uint8Array(16384));
    this.slots = [null, null, null, null];
    this.kbd = new Uint8Array(8).fill(0xff);
    this.autoKbd = new Uint8Array(8).fill(0xff);
    this.keyQueue = [];
    this.border = 7; this.borderStart = 7;
    this.borderT = new Int32Array(4096); this.borderC = new Uint8Array(4096); this.nBorder = 0;
    this.beepLevel = 0; this.beepStart = 0;
    this.beepT = new Int32Array(16384); this.beepV = new Uint8Array(16384); this.nBeep = 0;
    this.sampleRate = 48000; this.audioCarry = 0; this.dcX = 0; this.dcY = 0;
    this.ay = new AY(this.cpuHz / 2);
    this.tape = []; this.tapePos = 0;
    this.saved = []; this.onSave = null;
    this.frame = 0;
    this.cpu = new Z80({
      read: a => this.slots[a >> 14][a & 0x3fff],
      write: (a, v) => { if (a >= 0x4000) this.slots[a >> 14][a & 0x3fff] = v; },
      in: p => this.portIn(p),
      out: (p, v) => this.portOut(p, v),
    });
    this.reset();
  }

  reset() {
    this.cpu.reset();
    this.p7ffd = 0; this.pagingLocked = false;
    this.page();
    this.ay.reset();
    this.keyQueue.length = 0;
    this.autoKbd.fill(0xff);
  }

  page() {
    const p = this.p7ffd;
    this.slots[0] = this.roms[this.is128 ? (p >> 4) & 1 : 0];
    this.slots[1] = this.ram[5];
    this.slots[2] = this.ram[2];
    this.slots[3] = this.ram[this.is128 ? p & 7 : 0];
    this.screen = this.ram[this.is128 && (p & 8) ? 7 : 5];
  }

  portOut(port, v) {
    if (!(port & 1)) {
      const t = this.cpu.t;
      if ((v & 7) !== this.border) {
        this.border = v & 7;
        if (this.nBorder < 4096) { this.borderT[this.nBorder] = t; this.borderC[this.nBorder++] = this.border; }
      }
      const lvl = (v >> 4) & 1;
      if (lvl !== this.beepLevel) {
        this.beepLevel = lvl;
        if (this.nBeep < 16384) { this.beepT[this.nBeep] = t; this.beepV[this.nBeep++] = lvl; }
      }
    }
    if (this.is128) {
      if (!(port & 0x8002)) {
        if (!this.pagingLocked) { this.p7ffd = v; this.pagingLocked = !!(v & 0x20); this.page(); }
      } else if ((port & 0xc002) === 0xc000) this.ay.sel = v & 15;
      else if ((port & 0xc002) === 0x8000) this.ay.write(v);
    }
  }

  portIn(port) {
    if (!(port & 1)) {
      let r = 0x1f;
      const hi = port >> 8;
      for (let i = 0; i < 8; i++) if (!(hi & (1 << i))) r &= this.kbd[i] & this.autoKbd[i];
      return r | 0xa0 | (this.beepLevel ? 0x40 : 0);
    }
    if (this.is128 && (port & 0xc002) === 0xc000) return this.ay.read();
    if ((port & 0xff) === 0x1f) return 0; // Kempston joystick: nothing pressed
    return 0xff;
  }

  // ---- keyboard ----
  setKey(name, down) {
    const k = KEYS[name];
    if (!k) return;
    if (down) this.kbd[k[0]] &= ~k[1]; else this.kbd[k[0]] |= k[1];
  }
  releaseAllKeys() { this.kbd.fill(0xff); }
  // seq: [[keyNames...], ...] each held for `hold` frames with `gap` frames released in between
  typeKeys(seq, hold = 4, gap = 8) {
    for (const keys of seq) { this.keyQueue.push({ keys, frames: hold }); this.keyQueue.push({ keys: [], frames: gap }); }
  }

  // ---- tape ----
  setTape(bytes) {
    this.tape = [];
    for (let i = 0; i + 2 <= bytes.length;) {
      const len = bytes[i] | (bytes[i + 1] << 8);
      this.tape.push(bytes.subarray(i + 2, i + 2 + len));
      i += 2 + len;
    }
    this.tapePos = 0;
  }
  rom48Paged() { return this.slots[0] === this.fontRom; }

  // Instant tape loading/saving by intercepting the ROM's LD-BYTES and SA-BYTES routines.
  trap(pc) {
    const cpu = this.cpu;
    if (pc === 0x0556) {
      if (this.tapePos >= this.tape.length) return false;
      const blk = this.tape[this.tapePos++];
      let ok = false;
      if (blk.length >= 2 && blk[0] === cpu.a) {
        const want = cpu.de, have = blk.length - 2, n = Math.min(want, have);
        if (cpu.f & 1) for (let i = 0; i < n; i++) cpu.bus.write((cpu.ix + i) & 0xffff, blk[1 + i]);
        cpu.ix = (cpu.ix + n) & 0xffff;
        cpu.de = want - n;
        ok = want === have;
      }
      cpu.f = ok ? cpu.f | 1 : cpu.f & ~1;
    } else {
      const len = cpu.de, blk = new Uint8Array(len + 2);
      let x = blk[0] = cpu.a;
      for (let i = 0; i < len; i++) { const b = cpu.bus.read((cpu.ix + i) & 0xffff); blk[1 + i] = b; x ^= b; }
      blk[len + 1] = x;
      this.saved.push(blk);
      if (this.onSave) this.onSave(this.saved, blk[0] === 0xff);
    }
    cpu.pc = cpu.pop();
    return true;
  }
  // The saved blocks as a .tap file image.
  savedTap() {
    const total = this.saved.reduce((n, b) => n + b.length + 2, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const b of this.saved) { out[o++] = b.length & 255; out[o++] = b.length >> 8; out.set(b, o); o += b.length; }
    return out;
  }

  // Resets, loads a tape image through the ROM's own LOAD "" and lets it auto-run.
  loadAndRun(tap) {
    this.reset();
    this.setTape(tap);
    for (let i = 0; i < (this.is128 ? 180 : 110); i++) this.runFrame();
    if (this.is128) this.typeKeys([['ENTER']]); // first menu entry is "Tape Loader"
    else this.typeKeys([['J'], ['SYM', 'P'], ['SYM', 'P'], ['ENTER']]);
    for (let guard = 800; guard-- && (this.tapePos < this.tape.length || this.keyQueue.length);) this.runFrame();
    return this.tapePos >= this.tape.length;
  }

  // ---- execution ----
  runFrame() {
    const cpu = this.cpu, end = this.frameT;
    this.nBorder = 0; this.borderStart = this.border;
    this.nBeep = 0; this.beepStart = this.beepLevel;
    if (this.keyQueue.length) {
      const q = this.keyQueue[0];
      this.autoKbd.fill(0xff);
      for (const name of q.keys) { const k = KEYS[name]; this.autoKbd[k[0]] &= ~k[1]; }
      if (--q.frames <= 0) this.keyQueue.shift();
    } else this.autoKbd.fill(0xff);
    while (cpu.t < end) {
      if (cpu.t < 32 && cpu.iff1) cpu.interrupt();
      const pc = cpu.pc;
      if ((pc === 0x0556 || pc === 0x04c2) && this.rom48Paged() && this.trap(pc)) continue;
      cpu.step();
    }
    cpu.t -= end;
    this.frame++;
  }

  // Draws the last frame into a 320x240 Uint32Array (ABGR).
  render(buf) {
    let ev = 0, col = this.borderStart;
    const t0 = this.paperT - BORDER_T * this.lineT - 16;
    for (let y = 0; y < SCREEN_H; y++) {
      const lt = t0 + y * this.lineT;
      while (ev < this.nBorder && this.borderT[ev] <= lt) col = this.borderC[ev++];
      const c = PALETTE[col], row = y * SCREEN_W;
      if (y < BORDER_T || y >= BORDER_T + 192) buf.fill(c, row, row + SCREEN_W);
      else { buf.fill(c, row, row + BORDER_L); buf.fill(c, row + BORDER_L + 256, row + SCREEN_W); }
    }
    const scr = this.screen, flash = (this.frame & 16) !== 0;
    for (let y = 0; y < 192; y++) {
      let pa = ((y & 0xc0) << 5) | ((y & 7) << 8) | ((y & 0x38) << 2);
      let aa = 0x1800 + (y >> 3) * 32;
      let o = (y + BORDER_T) * SCREEN_W + BORDER_L;
      for (let x = 0; x < 32; x++) {
        const bits = scr[pa++], at = scr[aa++];
        const br = (at & 0x40) >> 3;
        let ink = PALETTE[(at & 7) | br], pap = PALETTE[((at >> 3) & 7) | br];
        if ((at & 0x80) && flash) { const s = ink; ink = pap; pap = s; }
        for (let m = 0x80; m; m >>= 1) buf[o++] = bits & m ? ink : pap;
      }
    }
  }

  // Sound for the last frame as mono float samples.
  audioFrame() {
    const exact = this.sampleRate * this.frameT / this.cpuHz + this.audioCarry;
    const n = Math.floor(exact);
    this.audioCarry = exact - n;
    const out = new Float32Array(n), tps = this.frameT / n;
    let ev = 0, level = this.beepStart;
    for (let i = 0; i < n; i++) {
      const t1 = (i + 1) * tps;
      let cur = i * tps, acc = 0;
      while (ev < this.nBeep && this.beepT[ev] < t1) {
        const et = Math.max(this.beepT[ev], cur);
        acc += level * (et - cur); cur = et; level = this.beepV[ev++];
      }
      acc += level * (t1 - cur);
      out[i] = (acc / tps) * 0.3;
    }
    if (this.is128) this.ay.render(out, this.sampleRate);
    for (let i = 0; i < n; i++) { // remove DC offset
      const x = out[i];
      this.dcY = x - this.dcX + 0.995 * this.dcY; this.dcX = x;
      out[i] = this.dcY;
    }
    return out;
  }

  // Reads the screen back as 24 lines of text by matching cells against the ROM font.
  screenText() {
    const font = this.fontRom, scr = this.screen, lines = [];
    for (let row = 0; row < 24; row++) {
      let s = '';
      for (let col = 0; col < 32; col++) {
        const base = ((row & 0x18) << 8) | ((row & 7) << 5) | col;
        let found = '?';
        for (let ch = 32; ch < 128 && found === '?'; ch++) {
          let norm = true, inv = true;
          for (let k = 0; k < 8; k++) {
            const b = scr[base + (k << 8)], f = font[0x3d00 + (ch - 32) * 8 + k];
            if (b !== f) norm = false;
            if (b !== (f ^ 0xff)) inv = false;
          }
          if (norm || (inv && ch !== 32)) found = String.fromCharCode(ch);
        }
        s += found;
      }
      lines.push(s.replace(/\s+$/, ''));
    }
    return lines;
  }
}
