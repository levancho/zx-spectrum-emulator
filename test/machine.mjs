// Headless checks: both models boot, and BASIC typed as plain text loads and runs correctly.
import { readFileSync } from 'node:fs';
import { Spectrum } from '../js/spectrum.js';
import { tokenise, makeTap } from '../js/basic.js';

const rom = n => new Uint8Array(readFileSync(new URL(`../roms/${n}`, import.meta.url)));
const ROMS = { 48: [rom('48.rom')], 128: [rom('128-0.rom'), rom('128-1.rom')] };
let failed = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '\n' + detail}`); if (!ok) failed++; };
const text = m => m.screenText().join('\n');

const PROGRAM = `
10 REM tokeniser test
20 LET total=0: FOR i=1 TO 10: LET total=total+i: NEXT i
30 PRINT "SUM=";total
40 PRINT 3.5*2;" ";1e3;" ";0.1+0.2;" ";70000;" ";BIN 101
50 DEF FN s(x,y)=x*x+y
60 PRINT FN s(3,4);" ";LEN "hello";" ";INT (PI*100)
70 IF total<>55 OR total<=1 THEN PRINT "BAD"
80 gosub 200: goto 100
90 PRINT "SKIPPED"
100 PRINT "DONE"
110 STOP
200 PRINT "SUB": RETURN
`;

for (const model of ['48', '128']) {
  const m = new Spectrum(model, ROMS[model]);
  for (let i = 0; i < 200; i++) m.runFrame();
  const boot = text(m);
  check(`${model}K boots`, model === '48' ? boot.includes('1982 Sinclair Research Ltd') : boot.includes('Tape Loader') && boot.includes('128 BASIC'), boot);

  const { bytes, firstLine, errors } = tokenise(PROGRAM);
  check(`${model}K tokenise`, errors.length === 0, errors.join('\n'));
  const loaded = m.loadAndRun(makeTap(bytes, 'test', firstLine));
  for (let i = 0; i < 100; i++) m.runFrame();
  const out = text(m);
  const want = ['SUM=55', '7 1000 0.3 70000 5', '13 5 314', 'SUB', 'DONE', '9 STOP statement, 110:1'];
  check(`${model}K runs typed BASIC`, loaded && want.every(w => out.includes(w)) && !out.includes('BAD') && !out.includes('SKIPPED'), out);
}

// Typing on the 48K keyboard: 10 PRINT "HI" / RUN
{
  const m = new Spectrum('48', ROMS[48]);
  for (let i = 0; i < 110; i++) m.runFrame();
  m.typeKeys([['1'], ['0'], ['P'], ['SYM', 'P'], ['CAPS', 'H'], ['CAPS', 'I'], ['SYM', 'P'], ['ENTER'], ['R'], ['ENTER']]);
  for (let i = 0; i < 250; i++) m.runFrame();
  const out = text(m);
  check('48K keyboard entry', out.includes('HI') && out.includes('0 OK, 10:1'), out);
  // SAVE goes through the tape trap and LOAD brings it back
  m.typeKeys([['S'], ['SYM', 'P'], ['A'], ['SYM', 'P'], ['ENTER'], ['ENTER']]);
  for (let i = 0; i < 300; i++) m.runFrame();
  check('48K SAVE captured', m.saved.length === 2 && m.saved[1][0] === 0xff, `blocks: ${m.saved.length}`);
  const m2 = new Spectrum('48', ROMS[48]);
  m2.loadAndRun(m.savedTap());
  m2.typeKeys([['R'], ['ENTER']]);
  for (let i = 0; i < 100; i++) m2.runFrame();
  check('48K LOAD of saved tape', text(m2).includes('HI'), text(m2));
}

// Sound: BEEP produces beeper transitions and non-silent audio
{
  const m = new Spectrum('48', ROMS[48]);
  const { bytes, firstLine } = tokenise('10 BEEP 1,0');
  m.loadAndRun(makeTap(bytes, 'beep', firstLine));
  let peak = 0;
  for (let i = 0; i < 20; i++) { m.runFrame(); for (const s of m.audioFrame()) peak = Math.max(peak, Math.abs(s)); }
  check('48K BEEP makes sound', peak > 0.05, `peak ${peak}`);
}

process.exit(failed ? 1 : 0);
