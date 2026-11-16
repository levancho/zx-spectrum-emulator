// Lessons for the "Learn BASIC" panel. `text` is trusted HTML written here; `code` is loaded into the editor.
export const LESSONS = [
  { title: '1. Lines and line numbers', text: `
<p>A BASIC program is a list of instructions. Every instruction sits on its own line, and every line starts with a <strong>line number</strong>.</p>
<p>The Spectrum runs the lines in number order, lowest first. The number is only an order and a name for the line; it is not printed.</p>
<p>Programmers count in tens (10, 20, 30) so there is room to add a line in between later, for example line 15. The editor adds the next number for you each time you press Enter.</p>
<p>Press <strong>Try it</strong>, then <strong>Run</strong>. The Spectrum prints the two messages, then shows a report at the bottom: <code>0 OK, 20:1</code>. That means "finished with no error; the last thing I did was line 20".</p>`,
    code: `10 PRINT "Line ten runs first"
20 PRINT "Line twenty runs second"
` },
  { title: '2. REM: notes for humans', text: `
<p><code>REM</code> is short for <strong>remark</strong>. The Spectrum ignores everything after REM on that line. It is a note for the person reading the program.</p>
<p>Use REM to give the program a title or to explain a tricky part. In this program lines 10 and 30 do nothing when it runs; only line 20 and line 40 print.</p>`,
    code: `10 REM This program says hello
20 PRINT "Hello!"
30 REM The next line prints a sum
40 PRINT 2+3
` },
  { title: '3. PRINT: showing things', text: `
<p><code>PRINT</code> puts something on the screen.</p>
<ul>
<li>Text goes inside quotes: <code>PRINT "Hello"</code> prints exactly those letters.</li>
<li>Without quotes the Spectrum works out the answer: <code>PRINT 6*7</code> prints 42.</li>
<li>A semicolon <code>;</code> joins things on the same line with no gap.</li>
<li>A comma <code>,</code> jumps to the middle of the screen, like a tab.</li>
<li><code>PRINT</code> on its own leaves an empty line.</li>
</ul>
<p>Sums use <code>+</code> <code>-</code> <code>*</code> (times) and <code>/</code> (divide).</p>`,
    code: `10 PRINT "Hello"
20 PRINT 6*7
30 PRINT "6 times 7 is ";6*7
40 PRINT
50 PRINT "left","right"
` },
  { title: '4. LET: remembering values', text: `
<p>A <strong>variable</strong> is a named box that holds a value. <code>LET</code> puts a value in the box.</p>
<ul>
<li><code>LET age=12</code> stores the number 12 in a box called <em>age</em>.</li>
<li>A box for text has a one-letter name ending in <code>$</code>: <code>LET n$="Anna"</code>.</li>
<li><code>LET age=age+1</code> means "take what is in age, add 1, put it back".</li>
</ul>
<p>If you use a variable before giving it a value, the Spectrum stops with the report <code>2 Variable not found</code>.</p>`,
    code: `10 LET n$="Anna"
20 LET age=12
30 PRINT n$;" is ";age
40 LET age=age+1
50 PRINT "Next year: ";age
` },
  { title: '5. INPUT: asking a question', text: `
<p><code>INPUT</code> stops the program and waits for the person to type something, then stores it in a variable.</p>
<p>After you press Run, click the Spectrum screen, type your answer and press Enter. The question appears at the bottom of the screen.</p>`,
    code: `10 INPUT "What is your name? ";n$
20 INPUT "How old are you? ";age
30 PRINT "Hello, ";n$
40 PRINT "In ten years you will be ";age+10
` },
  { title: '6. IF ... THEN: making decisions', text: `
<p><code>IF</code> tests something. When the test is true, the Spectrum does what comes after <code>THEN</code>. When it is false, it skips to the next line.</p>
<p>The tests are <code>=</code> equal, <code>&lt;</code> less than, <code>&gt;</code> greater than, <code>&lt;&gt;</code> not equal, <code>&lt;=</code> and <code>&gt;=</code>.</p>`,
    code: `10 INPUT "Type a number: ";n
20 IF n>100 THEN PRINT "That is big"
30 IF n<=100 THEN PRINT "That is small"
40 IF n=7 THEN PRINT "Lucky seven!"
` },
  { title: '7. FOR ... NEXT: repeating', text: `
<p><code>FOR</code> and <code>NEXT</code> repeat the lines between them. <code>FOR n=1 TO 5</code> runs them five times, with <em>n</em> counting 1, 2, 3, 4, 5.</p>
<p>Add <code>STEP</code> to count differently: <code>FOR n=10 TO 0 STEP -2</code> counts down in twos.</p>`,
    code: `10 FOR n=1 TO 5
20 PRINT "This is turn ";n
30 NEXT n
40 PRINT "Finished"
` },
  { title: '8. GO TO: jumping', text: `
<p><code>GO TO</code> jumps to another line by its number. This is why line numbers matter.</p>
<p>This program jumps back to line 20 for ever. To stop it, press the <strong>Break</strong> button (or Esc). If the screen fills up and asks <code>scroll?</code>, press any key to carry on, or Break to stop.</p>`,
    code: `10 LET n=1
20 PRINT n
30 LET n=n*2
40 GO TO 20
` },
  { title: '9. Colour and drawing', text: `
<p>Colours are numbered 0 to 7: 0 black, 1 blue, 2 red, 3 magenta, 4 green, 5 cyan, 6 yellow, 7 white.</p>
<ul>
<li><code>BORDER 1</code> colours the edge of the screen. <code>PAPER</code> is the background, <code>INK</code> is the pen. <code>CLS</code> clears the screen using the paper colour.</li>
<li>The drawing area is 256 dots wide and 176 high. Dot 0,0 is the bottom-left corner.</li>
<li><code>PLOT x,y</code> draws one dot. <code>DRAW a,b</code> draws a line from the last dot, going <em>a</em> across and <em>b</em> up. <code>CIRCLE x,y,r</code> draws a circle of radius <em>r</em>.</li>
</ul>`,
    code: `10 BORDER 1: PAPER 0: INK 6: CLS
20 PLOT 50,30
30 DRAW 150,0: DRAW 0,100
40 DRAW -150,0: DRAW 0,-100
50 INK 5: CIRCLE 125,80,40
60 INK 7: PRINT AT 0,9;"A box and a circle"
` },
  { title: '10. BEEP: sound', text: `
<p><code>BEEP time,note</code> plays a note. <em>time</em> is in seconds. <em>note</em> 0 is middle C, and each step of 1 is one piano key up (a semitone); negative numbers go lower.</p>
<p>A colon <code>:</code> lets you put several instructions on one line.</p>`,
    code: `10 BEEP 0.3,0: BEEP 0.3,4: BEEP 0.3,7
20 BEEP 0.6,12
30 FOR n=12 TO 0 STEP -1
40 BEEP 0.05,n
50 NEXT n
` },
  { title: '11. Reports and mistakes', text: `
<p>When a program stops, the Spectrum shows a <strong>report</strong> at the bottom of the screen: a code, a message, then the line and instruction where it stopped.</p>
<ul>
<li><code>0 OK, 30:1</code> finished normally at line 30.</li>
<li><code>C Nonsense in BASIC, 20:1</code> line 20 has a typing mistake, such as a missing quote or a misspelt keyword.</li>
<li><code>2 Variable not found</code> you used a variable before giving it a value with LET or INPUT.</li>
<li><code>B Integer out of range</code> a number is too big or too small, such as a colour above 7 or a dot off the screen.</li>
<li><code>E Out of DATA</code> a READ ran out of DATA values.</li>
<li><code>L BREAK into program</code> you pressed Break.</li>
</ul>
<p>The program below has a mistake on purpose. Run it, read the report, then fix line 20 and run it again.</p>`,
    code: `10 PRINT "Counting sheep"
20 PRINT sheep
30 PRINT "Good night"
` },
];
