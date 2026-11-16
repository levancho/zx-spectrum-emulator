// Runs a CP/M Z80 exerciser (zexdoc.com / zexall.com) against the CPU core.
// Usage: node test/zex.mjs test/zex/zexdoc.com
import { readFileSync } from 'node:fs';
import { Z80 } from '../js/z80.js';

const mem = new Uint8Array(65536);
mem.set(readFileSync(process.argv[2]), 0x100);
mem[5] = 0xc9;
mem[6] = 0x00; mem[7] = 0xf0; // top of memory for the program's stack
const cpu = new Z80({ read: a => mem[a], write: (a, v) => { mem[a] = v; }, in: () => 0xff, out: () => {} });
cpu.pc = 0x100;
let out = '';
const start = Date.now();
for (;;) {
  if (cpu.pc === 5) {
    if (cpu.c === 2) out += String.fromCharCode(cpu.e);
    else if (cpu.c === 9) for (let a = cpu.de; mem[a] !== 0x24; a = (a + 1) & 0xffff) out += String.fromCharCode(mem[a]);
    if (out.includes('\n')) { process.stdout.write(out); out = ''; }
  } else if (cpu.pc === 0) break;
  cpu.step();
}
process.stdout.write(out + `\n[finished in ${((Date.now() - start) / 1000).toFixed(0)}s]\n`);
