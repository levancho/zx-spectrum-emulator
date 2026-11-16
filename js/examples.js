export const EXAMPLES = [
  { name: 'Hello', code: `10 REM My first program
20 PRINT "Hello, world!"
30 PRINT "I am a ZX Spectrum."
` },
  { name: 'Counting loop', code: `10 REM Count from 1 to 10
20 FOR n=1 TO 10
30 PRINT n;" squared is ";n*n
40 NEXT n
` },
  { name: 'Times table', code: `10 INPUT "Which times table? ";t
20 CLS
30 FOR n=1 TO 12
40 PRINT n;" x ";t;" = ";n*t
50 NEXT n
` },
  { name: 'Guess the number', code: `10 REM Guess the number
20 RANDOMIZE
30 LET secret=INT (RND*100)+1
40 LET tries=0
50 PRINT "I am thinking of a number"
60 PRINT "between 1 and 100."
70 INPUT "Your guess? ";g
80 LET tries=tries+1
90 IF g<secret THEN PRINT g;" is too low": GO TO 70
100 IF g>secret THEN PRINT g;" is too high": GO TO 70
110 PRINT "Correct! You took ";tries;" tries."
120 BEEP 0.2,12: BEEP 0.4,19
` },
  { name: 'Drawing', code: `10 REM Lines and circles
20 BORDER 1: PAPER 0: INK 7: CLS
30 FOR a=0 TO 255 STEP 8
40 INK 1+a/40
50 PLOT 0,0: DRAW a,175
60 PLOT 255,0: DRAW -a,175
70 NEXT a
80 FOR r=10 TO 60 STEP 10
90 INK 7: CIRCLE 128,88,r
100 NEXT r
` },
  { name: 'Colours', code: `10 REM All the colours
20 FOR b=0 TO 1
30 FOR c=0 TO 7
40 PAPER c: BRIGHT b: INK 9
50 PRINT " colour ";c;"  bright ";b;"            "
60 NEXT c
70 NEXT b
80 PAPER 7: BRIGHT 0: INK 0
` },
  { name: 'Music', code: `10 REM Play a scale
20 FOR n=1 TO 8
30 READ note
40 BEEP 0.3,note
50 NEXT n
60 DATA 0,2,4,5,7,9,11,12
` },
  { name: 'Bouncing ball', code: `10 REM Bouncing ball
20 LET x=10: LET y=10: LET dx=1: LET dy=1
30 PRINT AT y,x;"O"
40 PAUSE 2
50 PRINT AT y,x;" "
60 LET x=x+dx: LET y=y+dy
70 IF x=0 OR x=31 THEN LET dx=-dx: BEEP 0.01,20
80 IF y=0 OR y=21 THEN LET dy=-dy: BEEP 0.01,10
90 GO TO 30
` },
];
