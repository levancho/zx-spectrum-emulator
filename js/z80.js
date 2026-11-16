// Zilog Z80 CPU core: all documented and undocumented opcodes, T-state counting.
const FS = 0x80, FZ = 0x40, FY = 0x20, FH = 0x10, FX = 0x08, FP = 0x04, FN = 0x02, FC = 0x01;
const SZ53 = new Uint8Array(256), SZ53P = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  let p = 0;
  for (let b = 0; b < 8; b++) if (i & (1 << b)) p ^= 1;
  SZ53[i] = (i & 0xa8) | (i ? 0 : FZ);
  SZ53P[i] = SZ53[i] | (p ? 0 : FP);
}

export class Z80 {
  // bus: { read(addr), write(addr, val), in(port), out(port, val) }
  constructor(bus) {
    this.bus = bus;
    this.reset();
  }

  reset() {
    this.a = 0xff; this.f = 0xff;
    this.b = this.c = this.d = this.e = this.h = this.l = 0;
    this.a_ = this.f_ = this.b_ = this.c_ = this.d_ = this.e_ = this.h_ = this.l_ = 0;
    this.ix = this.iy = 0xffff;
    this.sp = 0xffff; this.pc = 0;
    this.i = 0; this.r = 0; this.r7 = 0;
    this.iff1 = 0; this.iff2 = 0; this.im = 0;
    this.halted = false; this.eiDelay = false;
    this.wz = 0;
    this.t = 0;
  }

  get bc() { return (this.b << 8) | this.c; }
  set bc(v) { this.b = (v >> 8) & 255; this.c = v & 255; }
  get de() { return (this.d << 8) | this.e; }
  set de(v) { this.d = (v >> 8) & 255; this.e = v & 255; }
  get hl() { return (this.h << 8) | this.l; }
  set hl(v) { this.h = (v >> 8) & 255; this.l = v & 255; }

  rd(a) { return this.bus.read(a); }
  wr(a, v) { this.bus.write(a, v); }
  rd16(a) { return this.bus.read(a) | (this.bus.read((a + 1) & 0xffff) << 8); }
  wr16(a, v) { this.bus.write(a, v & 255); this.bus.write((a + 1) & 0xffff, (v >> 8) & 255); }
  fetch() { const v = this.bus.read(this.pc); this.pc = (this.pc + 1) & 0xffff; return v; }
  sfetch() { const v = this.fetch(); return v < 128 ? v : v - 256; }
  fetch16() { const lo = this.fetch(); return lo | (this.fetch() << 8); }
  push(v) {
    this.sp = (this.sp - 1) & 0xffff; this.bus.write(this.sp, (v >> 8) & 255);
    this.sp = (this.sp - 1) & 0xffff; this.bus.write(this.sp, v & 255);
  }
  pop() {
    const lo = this.bus.read(this.sp); this.sp = (this.sp + 1) & 0xffff;
    const hi = this.bus.read(this.sp); this.sp = (this.sp + 1) & 0xffff;
    return lo | (hi << 8);
  }

  getHL(m) { return m === 0 ? (this.h << 8) | this.l : m === 1 ? this.ix : this.iy; }
  setHL(m, v) { if (m === 0) { this.h = (v >> 8) & 255; this.l = v & 255; } else if (m === 1) this.ix = v; else this.iy = v; }

  gr(r, m) {
    switch (r) {
      case 0: return this.b; case 1: return this.c; case 2: return this.d; case 3: return this.e;
      case 4: return m === 0 ? this.h : m === 1 ? this.ix >> 8 : this.iy >> 8;
      case 5: return m === 0 ? this.l : m === 1 ? this.ix & 255 : this.iy & 255;
      case 7: return this.a;
    }
    return 0;
  }
  sr(r, m, v) {
    switch (r) {
      case 0: this.b = v; break; case 1: this.c = v; break; case 2: this.d = v; break; case 3: this.e = v; break;
      case 4: if (m === 0) this.h = v; else if (m === 1) this.ix = (this.ix & 255) | (v << 8); else this.iy = (this.iy & 255) | (v << 8); break;
      case 5: if (m === 0) this.l = v; else if (m === 1) this.ix = (this.ix & 0xff00) | v; else this.iy = (this.iy & 0xff00) | v; break;
      case 7: this.a = v; break;
    }
  }
  grp(p, m) {
    switch (p) { case 0: return this.bc; case 1: return this.de; case 2: return this.getHL(m); default: return this.sp; }
  }
  srp(p, m, v) {
    switch (p) { case 0: this.bc = v; break; case 1: this.de = v; break; case 2: this.setHL(m, v); break; default: this.sp = v; }
  }
  // Address of (HL) or (IX+d)/(IY+d)
  addr(m) {
    if (m === 0) return (this.h << 8) | this.l;
    const d = this.sfetch();
    this.t += 8;
    const a = ((m === 1 ? this.ix : this.iy) + d) & 0xffff;
    this.wz = a;
    return a;
  }
  cc(y) {
    switch (y) {
      case 0: return !(this.f & FZ); case 1: return !!(this.f & FZ);
      case 2: return !(this.f & FC); case 3: return !!(this.f & FC);
      case 4: return !(this.f & FP); case 5: return !!(this.f & FP);
      case 6: return !(this.f & FS); default: return !!(this.f & FS);
    }
  }

  add8(v, c) {
    const a = this.a, r = a + v + c;
    this.f = SZ53[r & 255] | ((r >> 8) & 1) | ((a ^ v ^ r) & FH) | (((a ^ r) & (v ^ r) & 0x80) >> 5);
    this.a = r & 255;
  }
  sub8(v, c) {
    const a = this.a, r = a - v - c;
    this.f = SZ53[r & 255] | ((r >> 8) & 1) | FN | ((a ^ v ^ r) & FH) | (((a ^ v) & (a ^ r) & 0x80) >> 5);
    this.a = r & 255;
  }
  alu(y, v) {
    switch (y) {
      case 0: this.add8(v, 0); break;
      case 1: this.add8(v, this.f & 1); break;
      case 2: this.sub8(v, 0); break;
      case 3: this.sub8(v, this.f & 1); break;
      case 4: this.a &= v; this.f = SZ53P[this.a] | FH; break;
      case 5: this.a ^= v; this.f = SZ53P[this.a]; break;
      case 6: this.a |= v; this.f = SZ53P[this.a]; break;
      default: {
        const a = this.a, r = a - v;
        this.f = (SZ53[r & 255] & 0xd7) | (v & 0x28) | ((r >> 8) & 1) | FN | ((a ^ v ^ r) & FH) | (((a ^ v) & (a ^ r) & 0x80) >> 5);
      }
    }
  }
  inc8(v) {
    const r = (v + 1) & 255;
    this.f = (this.f & FC) | SZ53[r] | ((r & 15) === 0 ? FH : 0) | (r === 0x80 ? FP : 0);
    return r;
  }
  dec8(v) {
    const r = (v - 1) & 255;
    this.f = (this.f & FC) | FN | SZ53[r] | ((r & 15) === 15 ? FH : 0) | (r === 0x7f ? FP : 0);
    return r;
  }
  add16(hl, v) {
    const r = hl + v;
    this.f = (this.f & (FS | FZ | FP)) | ((r >> 16) & 1) | ((r >> 8) & 0x28) | (((hl ^ v ^ r) >> 8) & FH);
    this.wz = (hl + 1) & 0xffff;
    return r & 0xffff;
  }
  rot(y, v) {
    let c;
    switch (y) {
      case 0: v = ((v << 1) | (v >> 7)) & 255; c = v & 1; break;
      case 1: c = v & 1; v = (v >> 1) | (c << 7); break;
      case 2: c = v >> 7; v = ((v << 1) | (this.f & 1)) & 255; break;
      case 3: c = v & 1; v = (v >> 1) | ((this.f & 1) << 7); break;
      case 4: c = v >> 7; v = (v << 1) & 255; break;
      case 5: c = v & 1; v = (v >> 1) | (v & 0x80); break;
      case 6: c = v >> 7; v = ((v << 1) | 1) & 255; break;
      default: c = v & 1; v >>= 1;
    }
    this.f = SZ53P[v] | c;
    return v;
  }
  bit(y, v, xy) {
    const r = v & (1 << y);
    this.f = (this.f & FC) | FH | (r ? 0 : FZ | FP) | (r & FS) | (xy & 0x28);
  }

  // Maskable interrupt. Returns true if accepted.
  interrupt() {
    if (!this.iff1 || this.eiDelay) return false;
    this.halted = false;
    this.iff1 = this.iff2 = 0;
    this.r++;
    this.push(this.pc);
    if (this.im === 2) {
      this.pc = this.rd16((this.i << 8) | 0xff);
      this.t += 19;
    } else {
      this.pc = 0x38;
      this.t += 13;
    }
    this.wz = this.pc;
    return true;
  }

  step() {
    this.eiDelay = false;
    this.r++;
    if (this.halted) { this.t += 4; return; }
    this.exec(this.fetch(), 0);
  }

  exec(op, m) {
    const x = op >> 6, y = (op >> 3) & 7, z = op & 7, p = y >> 1, q = y & 1;
    let v, a, d, c;
    if (x === 1) {
      if (op === 0x76) { this.halted = true; this.t += 4; return; }
      if (z === 6) { this.sr(y, 0, this.rd(this.addr(m))); this.t += 7; }
      else if (y === 6) { a = this.addr(m); this.wr(a, this.gr(z, 0)); this.t += 7; }
      else { this.sr(y, m, this.gr(z, m)); this.t += 4; }
      return;
    }
    if (x === 2) {
      if (z === 6) { v = this.rd(this.addr(m)); this.t += 7; } else { v = this.gr(z, m); this.t += 4; }
      this.alu(y, v);
      return;
    }
    if (x === 0) {
      switch (z) {
        case 0:
          switch (y) {
            case 0: this.t += 4; break;
            case 1:
              v = this.a; this.a = this.a_; this.a_ = v; v = this.f; this.f = this.f_; this.f_ = v;
              this.t += 4; break;
            case 2:
              d = this.sfetch(); this.b = (this.b - 1) & 255;
              if (this.b) { this.pc = (this.pc + d) & 0xffff; this.wz = this.pc; this.t += 13; } else this.t += 8;
              break;
            case 3:
              d = this.sfetch(); this.pc = (this.pc + d) & 0xffff; this.wz = this.pc; this.t += 12; break;
            default:
              d = this.sfetch();
              if (this.cc(y - 4)) { this.pc = (this.pc + d) & 0xffff; this.wz = this.pc; this.t += 12; } else this.t += 7;
          }
          break;
        case 1:
          if (q === 0) { this.srp(p, m, this.fetch16()); this.t += 10; }
          else { this.setHL(m, this.add16(this.getHL(m), this.grp(p, m))); this.t += 11; }
          break;
        case 2:
          switch (y) {
            case 0: a = this.bc; this.wr(a, this.a); this.wz = ((a + 1) & 255) | (this.a << 8); this.t += 7; break;
            case 1: a = this.bc; this.a = this.rd(a); this.wz = (a + 1) & 0xffff; this.t += 7; break;
            case 2: a = this.de; this.wr(a, this.a); this.wz = ((a + 1) & 255) | (this.a << 8); this.t += 7; break;
            case 3: a = this.de; this.a = this.rd(a); this.wz = (a + 1) & 0xffff; this.t += 7; break;
            case 4: a = this.fetch16(); this.wr16(a, this.getHL(m)); this.wz = (a + 1) & 0xffff; this.t += 16; break;
            case 5: a = this.fetch16(); this.setHL(m, this.rd16(a)); this.wz = (a + 1) & 0xffff; this.t += 16; break;
            case 6: a = this.fetch16(); this.wr(a, this.a); this.wz = ((a + 1) & 255) | (this.a << 8); this.t += 13; break;
            default: a = this.fetch16(); this.a = this.rd(a); this.wz = (a + 1) & 0xffff; this.t += 13;
          }
          break;
        case 3:
          this.srp(p, m, (this.grp(p, m) + (q ? -1 : 1)) & 0xffff); this.t += 6; break;
        case 4:
          if (y === 6) { a = this.addr(m); this.wr(a, this.inc8(this.rd(a))); this.t += 11; }
          else { this.sr(y, m, this.inc8(this.gr(y, m))); this.t += 4; }
          break;
        case 5:
          if (y === 6) { a = this.addr(m); this.wr(a, this.dec8(this.rd(a))); this.t += 11; }
          else { this.sr(y, m, this.dec8(this.gr(y, m))); this.t += 4; }
          break;
        case 6:
          if (y === 6) {
            if (m) {
              d = this.sfetch(); a = ((m === 1 ? this.ix : this.iy) + d) & 0xffff;
              this.wr(a, this.fetch()); this.t += 15;
            } else { this.wr(this.hl, this.fetch()); this.t += 10; }
          } else { this.sr(y, m, this.fetch()); this.t += 7; }
          break;
        default:
          a = this.a;
          switch (y) {
            case 0: a = ((a << 1) | (a >> 7)) & 255; this.f = (this.f & (FS | FZ | FP)) | (a & 0x29); break;
            case 1: c = a & 1; a = (a >> 1) | (c << 7); this.f = (this.f & (FS | FZ | FP)) | (a & 0x28) | c; break;
            case 2: c = a >> 7; a = ((a << 1) | (this.f & 1)) & 255; this.f = (this.f & (FS | FZ | FP)) | (a & 0x28) | c; break;
            case 3: c = a & 1; a = (a >> 1) | ((this.f & 1) << 7); this.f = (this.f & (FS | FZ | FP)) | (a & 0x28) | c; break;
            case 4: {
              let add = 0; c = this.f & FC; let h;
              if ((this.f & FH) || (a & 15) > 9) add = 6;
              if (c || a > 0x99) add |= 0x60;
              if (a > 0x99) c = 1;
              if (this.f & FN) { h = (this.f & FH) && (a & 15) < 6 ? FH : 0; a = (a - add) & 255; }
              else { h = (a & 15) > 9 ? FH : 0; a = (a + add) & 255; }
              this.f = (this.f & FN) | c | h | SZ53P[a];
              break;
            }
            case 5: a ^= 255; this.f = (this.f & (FS | FZ | FP | FC)) | (a & 0x28) | FH | FN; break;
            case 6: this.f = (this.f & (FS | FZ | FP)) | (a & 0x28) | FC; break;
            default: c = this.f & FC; this.f = (this.f & (FS | FZ | FP)) | (c ? FH : 0) | (a & 0x28) | (c ^ 1);
          }
          this.a = a; this.t += 4;
      }
      return;
    }
    // x === 3
    switch (z) {
      case 0:
        if (this.cc(y)) { this.pc = this.pop(); this.wz = this.pc; this.t += 11; } else this.t += 5;
        break;
      case 1:
        if (q === 0) {
          v = this.pop();
          if (p === 3) { this.a = v >> 8; this.f = v & 255; } else this.srp(p, m, v);
          this.t += 10;
        } else switch (p) {
          case 0: this.pc = this.pop(); this.wz = this.pc; this.t += 10; break;
          case 1:
            v = this.b; this.b = this.b_; this.b_ = v; v = this.c; this.c = this.c_; this.c_ = v;
            v = this.d; this.d = this.d_; this.d_ = v; v = this.e; this.e = this.e_; this.e_ = v;
            v = this.h; this.h = this.h_; this.h_ = v; v = this.l; this.l = this.l_; this.l_ = v;
            this.t += 4; break;
          case 2: this.pc = this.getHL(m); this.t += 4; break;
          default: this.sp = this.getHL(m); this.t += 6;
        }
        break;
      case 2:
        a = this.fetch16(); this.wz = a; if (this.cc(y)) this.pc = a; this.t += 10; break;
      case 3:
        switch (y) {
          case 0: this.pc = this.fetch16(); this.wz = this.pc; this.t += 10; break;
          case 1: this.cb(m); break;
          case 2: v = this.fetch(); this.bus.out((this.a << 8) | v, this.a); this.t += 11; break;
          case 3: v = this.fetch(); this.a = this.bus.in((this.a << 8) | v) & 255; this.t += 11; break;
          case 4: v = this.rd16(this.sp); this.wr16(this.sp, this.getHL(m)); this.setHL(m, v); this.wz = v; this.t += 19; break;
          case 5: v = this.d; this.d = this.h; this.h = v; v = this.e; this.e = this.l; this.l = v; this.t += 4; break;
          case 6: this.iff1 = this.iff2 = 0; this.t += 4; break;
          default: this.iff1 = this.iff2 = 1; this.eiDelay = true; this.t += 4;
        }
        break;
      case 4:
        a = this.fetch16(); this.wz = a;
        if (this.cc(y)) { this.push(this.pc); this.pc = a; this.t += 17; } else this.t += 10;
        break;
      case 5:
        if (q === 0) { this.push(p === 3 ? (this.a << 8) | this.f : this.grp(p, m)); this.t += 11; }
        else switch (p) {
          case 0: a = this.fetch16(); this.push(this.pc); this.pc = a; this.wz = a; this.t += 17; break;
          case 1: this.r++; this.t += 4; this.exec(this.fetch(), 1); break;
          case 2: this.ed(); break;
          default: this.r++; this.t += 4; this.exec(this.fetch(), 2);
        }
        break;
      case 6: this.alu(y, this.fetch()); this.t += 7; break;
      default: this.push(this.pc); this.pc = y * 8; this.wz = this.pc; this.t += 11;
    }
  }

  cb(m) {
    let a, v, op;
    if (m === 0) {
      this.r++;
      op = this.fetch();
      const x = op >> 6, y = (op >> 3) & 7, z = op & 7;
      if (z === 6) {
        a = this.hl; v = this.rd(a);
        if (x === 1) { this.bit(y, v, this.wz >> 8); this.t += 12; }
        else { this.wr(a, x === 0 ? this.rot(y, v) : x === 2 ? v & ~(1 << y) : v | (1 << y)); this.t += 15; }
      } else {
        v = this.gr(z, 0);
        if (x === 1) this.bit(y, v, v);
        else this.sr(z, 0, x === 0 ? this.rot(y, v) : x === 2 ? v & ~(1 << y) : v | (1 << y));
        this.t += 8;
      }
      return;
    }
    const d = this.sfetch();
    a = ((m === 1 ? this.ix : this.iy) + d) & 0xffff;
    this.wz = a;
    op = this.fetch();
    const x = op >> 6, y = (op >> 3) & 7, z = op & 7;
    v = this.rd(a);
    if (x === 1) { this.bit(y, v, a >> 8); this.t += 16; return; }
    v = x === 0 ? this.rot(y, v) : x === 2 ? v & ~(1 << y) : v | (1 << y);
    this.wr(a, v);
    if (z !== 6) this.sr(z, 0, v);
    this.t += 19;
  }

  ed() {
    this.r++;
    const op = this.fetch();
    const x = op >> 6, y = (op >> 3) & 7, z = op & 7, p = y >> 1, q = y & 1;
    let v, a, r, hl, c;
    if (x === 1) {
      switch (z) {
        case 0:
          v = this.bus.in(this.bc) & 255; this.wz = (this.bc + 1) & 0xffff;
          if (y !== 6) this.sr(y, 0, v);
          this.f = (this.f & FC) | SZ53P[v]; this.t += 12; break;
        case 1:
          this.bus.out(this.bc, y === 6 ? 0 : this.gr(y, 0)); this.wz = (this.bc + 1) & 0xffff; this.t += 12; break;
        case 2:
          hl = this.hl; v = this.grp(p, 0); c = this.f & 1;
          this.wz = (hl + 1) & 0xffff;
          if (q === 0) {
            r = hl - v - c;
            this.f = ((r >> 16) & 1) | FN | ((r >> 8) & 0xa8) | ((r & 0xffff) ? 0 : FZ) | (((hl ^ v ^ r) >> 8) & FH) | ((((hl ^ v) & (hl ^ r)) & 0x8000) >> 13);
          } else {
            r = hl + v + c;
            this.f = ((r >> 16) & 1) | ((r >> 8) & 0xa8) | ((r & 0xffff) ? 0 : FZ) | (((hl ^ v ^ r) >> 8) & FH) | ((((hl ^ r) & (v ^ r)) & 0x8000) >> 13);
          }
          this.hl = r & 0xffff; this.t += 15; break;
        case 3:
          a = this.fetch16(); this.wz = (a + 1) & 0xffff;
          if (q === 0) this.wr16(a, this.grp(p, 0)); else this.srp(p, 0, this.rd16(a));
          this.t += 20; break;
        case 4: v = this.a; this.a = 0; this.sub8(v, 0); this.t += 8; break;
        case 5: this.pc = this.pop(); this.wz = this.pc; this.iff1 = this.iff2; this.t += 14; break;
        case 6: this.im = [0, 0, 1, 2][y & 3]; this.t += 8; break;
        default:
          switch (y) {
            case 0: this.i = this.a; this.t += 9; break;
            case 1: this.r = this.a; this.r7 = this.a & 0x80; this.t += 9; break;
            case 2: this.a = this.i; this.f = (this.f & FC) | SZ53[this.a] | (this.iff2 ? FP : 0); this.t += 9; break;
            case 3: this.a = (this.r & 0x7f) | this.r7; this.f = (this.f & FC) | SZ53[this.a] | (this.iff2 ? FP : 0); this.t += 9; break;
            case 4:
              hl = this.hl; v = this.rd(hl);
              this.wr(hl, ((this.a << 4) | (v >> 4)) & 255); this.a = (this.a & 0xf0) | (v & 15);
              this.f = (this.f & FC) | SZ53P[this.a]; this.wz = (hl + 1) & 0xffff; this.t += 18; break;
            case 5:
              hl = this.hl; v = this.rd(hl);
              this.wr(hl, ((v << 4) | (this.a & 15)) & 255); this.a = (this.a & 0xf0) | (v >> 4);
              this.f = (this.f & FC) | SZ53P[this.a]; this.wz = (hl + 1) & 0xffff; this.t += 18; break;
            default: this.t += 8;
          }
      }
      return;
    }
    if (x === 2 && z <= 3 && y >= 4) {
      const dir = (y & 1) ? -1 : 1, rep = y >= 6;
      hl = this.hl;
      switch (z) {
        case 0: {
          v = this.rd(hl); this.wr(this.de, v);
          this.hl = (hl + dir) & 0xffff; this.de = (this.de + dir) & 0xffff;
          const bc = (this.bc - 1) & 0xffff; this.bc = bc;
          const n = (v + this.a) & 255;
          this.f = (this.f & (FS | FZ | FC)) | (bc ? FP : 0) | (n & FX) | ((n & 2) ? FY : 0);
          this.t += 16;
          if (rep && bc) { this.pc = (this.pc - 2) & 0xffff; this.wz = (this.pc + 1) & 0xffff; this.t += 5; }
          break;
        }
        case 1: {
          v = this.rd(hl); r = (this.a - v) & 255;
          const h = (this.a ^ v ^ r) & FH;
          this.hl = (hl + dir) & 0xffff;
          const bc = (this.bc - 1) & 0xffff; this.bc = bc;
          const n = (r - (h ? 1 : 0)) & 255;
          this.f = (this.f & FC) | FN | (SZ53[r] & 0xd7) | h | (bc ? FP : 0) | (n & FX) | ((n & 2) ? FY : 0);
          this.wz = (this.wz + dir) & 0xffff;
          this.t += 16;
          if (rep && bc && r) { this.pc = (this.pc - 2) & 0xffff; this.wz = (this.pc + 1) & 0xffff; this.t += 5; }
          break;
        }
        case 2: {
          v = this.bus.in(this.bc) & 255; this.wr(hl, v);
          this.hl = (hl + dir) & 0xffff;
          this.b = (this.b - 1) & 255;
          const k = v + ((this.c + dir) & 255);
          this.f = SZ53[this.b] | ((v >> 6) & FN) | (k > 255 ? FH | FC : 0) | (SZ53P[(k & 7) ^ this.b] & FP);
          this.t += 16;
          if (rep && this.b) { this.pc = (this.pc - 2) & 0xffff; this.t += 5; }
          break;
        }
        default: {
          v = this.rd(hl);
          this.b = (this.b - 1) & 255;
          this.bus.out(this.bc, v);
          this.hl = (hl + dir) & 0xffff;
          const k = v + this.l;
          this.f = SZ53[this.b] | ((v >> 6) & FN) | (k > 255 ? FH | FC : 0) | (SZ53P[(k & 7) ^ this.b] & FP);
          this.t += 16;
          if (rep && this.b) { this.pc = (this.pc - 2) & 0xffff; this.t += 5; }
        }
      }
      return;
    }
    this.t += 8; // undefined ED opcodes act as NOP
  }
}
