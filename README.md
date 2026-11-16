# ZX Spectrum Classroom

A ZX Spectrum 48K and 128K emulator that runs in the browser, built for teaching programming.
Students type Sinclair BASIC in a normal text editor beside the screen and press **Run**; the
original Spectrum keyboard also works for anyone who wants the authentic experience.

## Running it

It is a static site with no build step. Serve the folder over HTTP and open it:

```bash
python3 -m http.server 8048
```

Then open http://localhost:8048. Any static host (GitHub Pages, a school web server) works the same way.
Opening `index.html` directly from disk does not work, because browsers block module loading from `file://`.

## Using it

- **Editor panel:** write a program with one numbered line per row and press **Run** (or Ctrl+Enter).
  Keywords can be upper or lower case and need a space after them. `GOTO` and `GOSUB` are accepted
  as well as `GO TO` and `GO SUB`. The program is kept in the browser between visits; **Save** and
  **Open** store it as a text file.
- **Spectrum keyboard:** click the screen, then type. Shift is CAPS SHIFT, Ctrl or Alt is SYMBOL SHIFT,
  Esc is BREAK. Punctuation, arrow keys and Backspace on a modern keyboard are translated for you.
  The on-screen keyboard shows which keyword each key gives on the 48K.
- **Run shows the program first:** the Spectrum lists the program for a moment, then runs it. Untick
  "Show the program on the Spectrum before it runs" to start straight away.
- **Learn BASIC tab:** eleven lessons. Point at any line of a lesson's program to read what that line does.
- **Language:** the button in the header switches the page, lessons and explanations between English and Georgian.
- **Model:** switch between the 48K (single-key keywords) and the 128K (type keywords letter by letter,
  three-channel sound).
- **Tapes:** `SAVE "name"` on the Spectrum is captured and can be downloaded as a `.tap` file;
  **Insert tape** loads a `.tap` file for `LOAD ""`.

## What is emulated

- Z80 CPU with documented and undocumented instructions and flags (passes the `zexdoc` and `zexall` exercisers)
- 48K and 128K memory maps, 128K ROM and RAM paging
- Screen with colour attributes, FLASH and per-scanline border
- Keyboard matrix, beeper, AY-3-8912 sound chip (128K)
- Instant tape loading and saving of `.tap` files through the ROM's tape routines

Not emulated: contended-memory timing, the floating bus, mid-scanline colour effects, real-time tape
audio (`.tzx`, turbo loaders), snapshots, joysticks, Interface 1 and printers. These matter for some
commercial games and demos, not for BASIC programming.

## Tests

```bash
npm test          # boots both models and runs BASIC programs headlessly
npm run test:cpu  # Z80 instruction exercisers (about two minutes)
```

## Layout

| Path | Contents |
|---|---|
| `js/z80.js` | Z80 CPU core |
| `js/spectrum.js` | The machine: memory, video, keyboard, sound, tape |
| `js/basic.js` | Plain-text BASIC to tokenised program and `.tap` image |
| `js/main.js` | Page logic: display, audio, keyboard, editor |
| `js/examples.js` | Example programs shown in the editor |
| `js/tutorial.js` | Lessons and line-by-line explanations (English and Georgian) |
| `js/i18n.js` | Page text in English and Georgian |
| `roms/` | Sinclair ROM images (see `roms/README.md`) |
| `test/` | Headless tests and the Z80 exerciser programs |
