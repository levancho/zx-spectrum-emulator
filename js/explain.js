// Explains any line of Sinclair BASIC in plain words, in English (en) or Georgian (ka).
// explainLine(text, lang) returns { num, parts, pieces }: a summary per instruction, plus every
// item on the line (keyword, values, punctuation) with its own explanation.

const T = {
  en: {
    colours: ['black', 'blue', 'red', 'magenta', 'green', 'cyan', 'yellow', 'white', 'no change', 'contrast: black or white, whichever shows up best'],
    letPut: 'Puts {1} in the variable {0}.',
    noNumber: 'This row has no line number. Every line of a program needs a number at the start.',
    empty: 'This line has a number but no instruction yet.',
    unknown: 'The Spectrum will not understand {0}. An instruction must start with a BASIC keyword such as PRINT or LET.',
    noLet: 'This looks like it stores a value, but the keyword is missing. Write it as {0}.',
    REM: 'A remark. The Spectrum ignores this line; it is a note for people reading the program.',
    printEmpty: 'Leaves one empty row on the screen.',
    print: 'Shows on the screen: {0}.',
    then: ', then ',
    pText: 'the text {0}',
    pValue: 'the value of {0}',
    pAt: 'moves to row {0}, column {1}',
    pTab: 'moves to column {0}',
    pColour: 'uses {0} for this PRINT',
    printStay: 'The semicolon at the end keeps the next PRINT on the same row.',
    printComma: 'A comma jumps to the next half of the screen.',
    let: 'Works out {1} and stores the result in the variable {0}.',
    letText: 'Stores the text {1} in the text variable {0}.',
    input: 'Waits for you to type something and press Enter, then stores it in {0}.',
    inputAsk: 'First it shows the question {0}.',
    if: 'Tests whether {0} is true. If it is, the Spectrum does the rest of the line:',
    ifElse: 'If it is not true, it skips to the next line.',
    for: 'Starts a loop. {0} counts from {1} to {2}. The lines down to NEXT {0} repeat for each count.',
    forStep: 'Starts a loop. {0} counts from {1} to {2} in steps of {3}. The lines down to NEXT {0} repeat for each count.',
    NEXT: 'End of the loop. Moves {0} to its next value and jumps back to the line after FOR, until the loop has finished.',
    goto: 'Jumps to line {0} and carries on from there.',
    gosub: 'Jumps to the subroutine at line {0}. RETURN brings the program back here.',
    RETURN: 'Goes back to just after the GO SUB that jumped here.',
    CLS: 'Clears the screen, filling it with the paper colour.',
    BORDER: 'Sets the colour of the border around the screen to {0}.',
    PAPER: 'Sets the background colour for what is printed next to {0}.',
    INK: 'Sets the pen colour for what is printed or drawn next to {0}.',
    BRIGHT: 'Switches extra brightness on (1) or off (0): {0}.',
    FLASH: 'Switches flashing on (1) or off (0): {0}.',
    INVERSE: 'Switches swapped pen and paper colours on (1) or off (0): {0}.',
    OVER: 'Switches overprinting on (1) or off (0): {0}.',
    PLOT: 'Draws one dot {0} across and {1} up from the bottom-left corner.',
    DRAW: 'Draws a line from the last dot: {0} across and {1} up.',
    drawArc: 'Draws a curved line from the last dot: {0} across and {1} up, bending by {2}.',
    CIRCLE: 'Draws a circle with its centre at {0},{1} and a radius of {2}.',
    BEEP: 'Plays a note for {0} seconds at pitch {1}. Pitch 0 is middle C; each 1 is one piano key higher.',
    PAUSE: 'Waits for {0} fiftieths of a second (50 is one second). PAUSE 0 waits until a key is pressed.',
    RANDOMIZE: 'Shuffles the random numbers, so RND gives different numbers every time the program runs.',
    DIM: 'Makes an array, a numbered row of boxes: {0}.',
    READ: 'Takes the next value from the DATA list and stores it in {0}.',
    DATA: 'A list of values for READ to take one at a time: {0}.',
    RESTORE: 'Makes READ start again from the beginning of the DATA.',
    STOP: 'Stops the program here.',
    POKE: 'Puts the number {1} straight into memory location {0}.',
    CLEAR: 'Forgets all variables.',
    RUN: 'Starts the program from the beginning.',
    LIST: 'Shows the program listing.',
    NEW: 'Erases the whole program from memory.',
    SAVE: 'Saves the program to tape with the name {0}.',
    LOAD: 'Loads a program from tape.',
    CONTINUE: 'Carries on after the program was stopped.',
    DEFFN: 'Defines your own function: {0}.',
    OUT: 'Sends a value to a hardware port: {0}.',
    COPY: 'Sends the screen to the printer.',
    fRND: 'RND gives a random number between 0 and 1.',
    fINT: 'INT throws away the part after the decimal point.',
    fINKEY: 'INKEY$ is the key being pressed at this moment, without waiting.',
    fSQR: 'SQR is the square root.',
    fABS: 'ABS removes a minus sign.',
    fLEN: 'LEN counts the characters in a text.',
    fPI: 'PI is 3.14159…',
    fSIN: 'SIN and COS are used to work out points on a circle.',
    fCHR: 'CHR$ turns a code number into a character.',
    fAT: 'AT row,column chooses where on the screen to print.',
  },
  ka: {
    colours: ['შავი', 'ლურჯი', 'წითელი', 'იისფერი', 'მწვანე', 'ცისფერი', 'ყვითელი', 'თეთრი', 'უცვლელი', 'კონტრასტული: შავი ან თეთრი, რომელიც უკეთ ჩანს'],
    letPut: 'ცვლადში {0} წერს რიცხვს {1}.',
    noNumber: 'ამ სტრიქონს ხაზის ნომერი არ აქვს. პროგრამის ყველა ხაზი ნომრით უნდა იწყებოდეს.',
    empty: 'ამ ხაზს ნომერი აქვს, მაგრამ ბრძანება ჯერ არ წერია.',
    unknown: 'Spectrum ვერ გაიგებს ამას: {0}. ბრძანება BASIC-ის სიტყვით უნდა იწყებოდეს, მაგალითად PRINT ან LET.',
    noLet: 'როგორც ჩანს, აქ მნიშვნელობის შენახვა გინდა, მაგრამ ბრძანების სიტყვა აკლია. დაწერე ასე: {0}.',
    REM: 'შენიშვნა. Spectrum ამ ხაზს გამოტოვებს; ეს ჩანაწერია ადამიანებისთვის, ვინც პროგრამას კითხულობს.',
    printEmpty: 'ეკრანზე ერთ ცარიელ სტრიქონს ტოვებს.',
    print: 'ეკრანზე ბეჭდავს: {0}.',
    then: ', შემდეგ ',
    pText: 'ტექსტს {0}',
    pValue: '{0}-ის მნიშვნელობას',
    pAt: '(სტრიქონზე {0}, სვეტზე {1})',
    pTab: '(სვეტიდან {0})',
    pColour: '(პარამეტრით {0})',
    printStay: 'ბოლოში დასმული წერტილ-მძიმის გამო შემდეგი PRINT იმავე სტრიქონზე გააგრძელებს.',
    printComma: 'მძიმის გამო შემდეგი მნიშვნელობა ეკრანის შემდეგ ნახევარში იბეჭდება.',
    let: 'გამოითვლის, რას უდრის {1}, და პასუხს ცვლადში {0} წერს.',
    letText: 'ტექსტს {1} წერს ტექსტურ ცვლადში {0}.',
    input: 'ელოდება, სანამ პასუხს აკრეფ და Enter-ს დააჭერ, შემდეგ კი პასუხს წერს ცვლადში {0}.',
    inputAsk: 'მანამდე ეკრანზე აჩვენებს კითხვას {0}.',
    if: 'ამოწმებს, სრულდება თუ არა პირობა {0}. თუ სრულდება, Spectrum ასრულებს ხაზის დანარჩენ ნაწილს:',
    ifElse: 'თუ პირობა არ სრულდება, პროგრამა შემდეგ ხაზზე გადადის.',
    for: 'იწყებს ციკლს. მთვლელი {0} იცვლება {1}-დან {2}-მდე, და ყოველ ჯერზე სრულდება ყველა ხაზი აქედან NEXT {0}-მდე.',
    forStep: 'იწყებს ციკლს. მთვლელი {0} იცვლება {1}-დან {2}-მდე, ბიჯით {3}, და ყოველ ჯერზე სრულდება ყველა ხაზი აქედან NEXT {0}-მდე.',
    NEXT: 'ციკლის ბოლო. მთვლელი {0} შემდეგ მნიშვნელობას იღებს და პროგრამა FOR-ის მომდევნო ხაზს უბრუნდება, სანამ თვლა არ დამთავრდება.',
    goto: 'პროგრამა გადადის ხაზზე {0} და იქიდან აგრძელებს.',
    gosub: 'გადადის ქვეპროგრამაზე ხაზზე {0}. RETURN პროგრამას აქ დააბრუნებს.',
    RETURN: 'ბრუნდება იმ GO SUB-ის შემდეგ, რომელმაც აქ გადმოიყვანა.',
    CLS: 'ასუფთავებს ეკრანს და ავსებს მას ფონის ფერით.',
    BORDER: 'ცვლის ეკრანის ჩარჩოს ფერს. ახალი ფერი: {0}.',
    PAPER: 'ცვლის ფონის ფერს იმისთვის, რაც ამის შემდეგ დაიბეჭდება. ახალი ფერი: {0}.',
    INK: 'ცვლის ასოებისა და ნახაზის ფერს. ახალი ფერი: {0}.',
    BRIGHT: 'რთავს (1) ან თიშავს (0) დამატებით სიკაშკაშეს: {0}.',
    FLASH: 'რთავს (1) ან თიშავს (0) ციმციმს: {0}.',
    INVERSE: 'რთავს (1) ან თიშავს (0) კალმისა და ფონის ფერების შენაცვლებას: {0}.',
    OVER: 'რთავს (1) ან თიშავს (0) ზემოდან დაბეჭდვას: {0}.',
    PLOT: 'სვამს ერთ წერტილს: ქვედა მარცხენა კუთხიდან {0} მარჯვნივ და {1} ზევით.',
    DRAW: 'ხაზავს ხაზს ბოლო წერტილიდან: {0} მარჯვნივ და {1} ზევით.',
    drawArc: 'ხაზავს მრუდ ხაზს ბოლო წერტილიდან: {0} მარჯვნივ და {1} ზევით, გამრუდებით {2}.',
    CIRCLE: 'ხაზავს წრეს, რომლის ცენტრია {0},{1}, რადიუსი კი {2}.',
    BEEP: 'უკრავს ნოტს {0} წამის განმავლობაში, სიმაღლით {1}. სიმაღლე 0 პირველი ოქტავის „დო“-ა; ყოველი 1 ერთი კლავიშით მაღლაა.',
    PAUSE: 'ელოდება {0} ორმოცდამეათედ წამს (50 ერთი წამია). PAUSE 0 ელოდება კლავიშის დაჭერას.',
    RANDOMIZE: 'ურევს შემთხვევით რიცხვებს, რომ RND-მ ყოველ გაშვებაზე სხვადასხვა რიცხვი მოგცეს.',
    DIM: 'ქმნის მასივს, ანუ დანომრილი ყუთების რიგს: {0}.',
    READ: 'იღებს შემდეგ მნიშვნელობას DATA-ს სიიდან და ინახავს აქ: {0}.',
    DATA: 'მნიშვნელობების სია, რომლებსაც READ რიგრიგობით იღებს: {0}.',
    RESTORE: 'READ-ს ისევ DATA-ს დასაწყისიდან აწყებინებს.',
    STOP: 'აჩერებს პროგრამას ამ ადგილას.',
    POKE: 'რიცხვს {1} პირდაპირ წერს მეხსიერების უჯრაში {0}.',
    CLEAR: 'ივიწყებს ყველა ცვლადს.',
    RUN: 'პროგრამას თავიდან უშვებს.',
    LIST: 'აჩვენებს პროგრამის ტექსტს.',
    NEW: 'მთელ პროგრამას შლის მეხსიერებიდან.',
    SAVE: 'პროგრამას კასეტაზე ინახავს სახელით {0}.',
    LOAD: 'პროგრამას კასეტიდან ტვირთავს.',
    CONTINUE: 'აგრძელებს გაჩერებულ პროგრამას.',
    DEFFN: 'განსაზღვრავს შენს საკუთარ ფუნქციას: {0}.',
    OUT: 'მნიშვნელობას აგზავნის აპარატურის პორტში: {0}.',
    COPY: 'ეკრანს პრინტერზე აგზავნის.',
    fRND: 'RND იძლევა შემთხვევით რიცხვს 0-სა და 1-ს შორის.',
    fINT: 'INT აგდებს რიცხვის წილად ნაწილს.',
    fINKEY: 'INKEY$ არის კლავიში, რომელიც ამ წამს არის დაჭერილი; პროგრამა არ ელოდება.',
    fSQR: 'SQR კვადრატული ფესვია.',
    fABS: 'ABS აშორებს მინუს ნიშანს.',
    fLEN: 'LEN ითვლის, რამდენი სიმბოლოა ტექსტში.',
    fPI: 'PI არის 3.14159…',
    fSIN: 'SIN და COS წრეზე წერტილების გამოსათვლელად გამოიყენება.',
    fCHR: 'CHR$ კოდის ნომერს სიმბოლოდ აქცევს.',
    fAT: 'AT სტრიქონი,სვეტი ირჩევს, ეკრანის რომელ ადგილას დაიბეჭდოს.',
  },
};

// ---------- piece-by-piece strings ----------
const X = {
  en: {
    lineNum: 'The line number. The Spectrum runs the lines in order of their numbers, smallest first.',
    sColon: 'A colon separates two instructions written on the same line. The one on the left is done first.',
    sSemi: 'A semicolon between two things to print: the next one is printed right after this one, with no space in between.',
    sSemiEnd: 'A semicolon at the end: the next PRINT carries on in the same row instead of starting a new row.',
    sComma: 'A comma between two things to print: the next one starts in the other half of the screen (column 0 or column 16).',
    sApos: 'An apostrophe starts a new row.',
    sAtComma: 'A comma separates the row from the column.',
    sArgComma: 'A comma separates the values this instruction needs.',
    sLetEq: 'Here = means "becomes": the value on the right goes into the variable on the left.',
    sForEq: 'Here = gives the counter its first value.',
    sInSemi: 'A semicolon: you type your answer right after the question.',
    sInComma: 'A comma: your answer starts in the other half of the screen.',
    kText: 'Text in quotes.',
    kNum: 'A number.',
    kVar: 'The variable {0}: a named box that holds a number.',
    kSVar: 'The text variable {0}: a named box that holds text. The $ at the end of the name means text.',
    kCalc: 'A calculation. The Spectrum works out the answer first.',
    kUses: 'It uses the value stored in {0}.',
    xText: 'It is printed exactly as written, spaces included. The quote marks are not printed.',
    xNum: 'It is printed as it is.',
    xVar: 'The value stored in it is printed, not its name.',
    xCalc: 'The answer is printed.',
    oAdd: '<code>+</code> adds (with texts, it joins them).',
    oSub: '<code>-</code> subtracts, or makes a number negative.',
    oMul: '<code>*</code> multiplies.',
    oDiv: '<code>/</code> divides.',
    oPow: '<code>^</code> raises to a power.',
    oLt: '<code>&lt;</code> asks "is it less than?".',
    oGt: '<code>&gt;</code> asks "is it greater than?".',
    oLe: '<code>&lt;=</code> asks "is it less than or equal to?".',
    oGe: '<code>&gt;=</code> asks "is it greater than or equal to?".',
    oNe: '<code>&lt;&gt;</code> asks "is it different from?".',
    oEq: '<code>=</code> here asks "is it equal to?".',
    oBr: 'Brackets <code>( )</code>: the part inside is worked out first, or it is what a function works on.',
    oAnd: '<code>AND</code>: both tests must be true.',
    oOr: '<code>OR</code>: at least one of the tests must be true.',
    oNot: '<code>NOT</code> turns true into false and false into true.',
    fVAL: 'VAL turns a text such as "12" into a number.',
    fSTR: 'STR$ turns a number into text.',
    fCODE: 'CODE gives the code number of a character.',
    fPEEK: 'PEEK reads the number in a memory location.',
    fOther: '{0} is a built-in function.',
    kAT: 'AT chooses the place on the screen for what is printed next: first the row, then the column.',
    kTAB: 'TAB moves along the row to a column.',
    kInPrint: 'Inside PRINT it applies to this PRINT only.',
    rRow: 'The row: 0 is the top row, 21 the bottom one.',
    rCol: 'The column: 0 is the left edge, 31 the right edge.',
    rTabCol: 'The column to move to (0 to 31).',
    rLetName: 'The name of the variable that receives the value.',
    rLetNameS: 'The name of the variable that receives the value. The $ at the end means it holds text.',
    rLetVal: 'The value to store.',
    rAsk: 'The question shown on the screen while the Spectrum waits. The quote marks are not shown.',
    rInNum: 'The variable where your answer is stored. Its name has no $, so you must type a number.',
    rInText: 'The text variable where your answer is stored. The $ means you can type any text.',
    rCond: 'The test. It is either true or false.',
    kTHEN: 'THEN: what comes after it is done only when the test is true.',
    rForVar: 'The counter: a variable that changes each time round the loop.',
    rFrom: 'The first value of the counter.',
    kTO: 'TO: count up to and including the value after it.',
    rTo: 'The last value of the counter.',
    kSTEP: 'STEP says how much the counter changes each time. Without STEP it changes by 1.',
    rStep: 'The amount added each time (a negative number counts down).',
    rNextVar: 'The counter of the loop. It must be the same one as in FOR.',
    rLineNo: 'The number of the line to jump to.',
    rColour: 'The colour number: {0}.',
    rColourAny: 'The colour number, 0 to 7 (0 black, 1 blue, 2 red, 3 magenta, 4 green, 5 cyan, 6 yellow, 7 white).',
    rOnOff: '1 switches it on, 0 switches it off.',
    rX: 'How far across: 0 is the left edge, 255 the right edge.',
    rY: 'How far up: 0 is the bottom, 175 the top.',
    rDx: 'How far to the right (a negative number goes left).',
    rDy: 'How far up (a negative number goes down).',
    rBend: 'How much the line bends, as an angle.',
    rCx: 'The centre of the circle: how far across.',
    rCy: 'The centre of the circle: how far up.',
    rRadius: 'The radius: the distance from the centre to the edge.',
    rSecs: 'How long the note lasts, in seconds.',
    rPitch: 'The pitch: 0 is middle C, each 1 is one piano key higher, negative numbers are lower.',
    rWait: 'How long to wait, in fiftieths of a second. 0 means: until a key is pressed.',
    rAddr: 'The memory location.',
    rPokeVal: 'The number to put there (0 to 255).',
    rDim: 'The name of the array and, in brackets, how many boxes it has.',
    rReadVar: 'A variable that receives the next value from DATA.',
    rDataVal: 'One value in the list.',
    rName: 'The name of the program on tape.',
    rRemText: 'The note itself. Write anything here; the Spectrum does not read it.',
    rValue: 'A value for this instruction.',
    kw: {
      REM: 'REM starts a remark, a note for people. The Spectrum ignores the rest of the line.',
      PRINT: 'PRINT shows things on the screen.',
      LET: 'LET stores a value in a variable.',
      INPUT: 'INPUT waits for you to type an answer and press Enter.',
      IF: 'IF starts a test.',
      FOR: 'FOR starts a loop that counts.',
      NEXT: 'NEXT marks the end of a FOR loop.',
      GOTO: 'GO TO jumps to another line.',
      GOSUB: 'GO SUB jumps to a subroutine and remembers where to come back to.',
      BORDER: 'BORDER sets the colour of the border around the screen.',
      PAPER: 'PAPER sets the background colour.',
      INK: 'INK sets the pen colour.',
      BRIGHT: 'BRIGHT makes colours brighter.',
      FLASH: 'FLASH makes what is printed blink.',
      INVERSE: 'INVERSE swaps the pen and background colours.',
      OVER: 'OVER prints on top of what is already there.',
      PLOT: 'PLOT draws one dot.',
      DRAW: 'DRAW draws a line starting from the last dot.',
      CIRCLE: 'CIRCLE draws a circle.',
      BEEP: 'BEEP plays a note.',
      PAUSE: 'PAUSE makes the program wait.',
      DIM: 'DIM makes an array: a row of numbered boxes.',
      READ: 'READ takes values from the DATA list.',
      DATA: 'DATA holds a list of values for READ.',
      POKE: 'POKE puts a number straight into the computer\'s memory.',
      SAVE: 'SAVE stores the program on tape.',
      LOAD: 'LOAD reads a program from tape.',
      DEFFN: 'DEF FN defines your own function.',
      OUT: 'OUT sends a number to a hardware port.',
    },
  },
  ka: {
    lineNum: 'ხაზის ნომერი. Spectrum პროგრამას ნომრების მიხედვით ასრულებს: ჯერ პატარა ნომერს, მერე დიდს.',
    sColon: 'ორწერტილი ერთ ხაზზე ორ ბრძანებას ყოფს. ჯერ მარცხენა ბრძანება სრულდება, მერე მარჯვენა.',
    sSemi: 'წერტილ-მძიმე ნიშნავს „გვერდით მიაწერე“: რაც მის შემდეგ წერია, ეკრანზე პირდაპირ გვერდით დაიბეჭდება, შუალედის გარეშე.',
    sSemiEnd: 'ბოლოში დასმული წერტილ-მძიმე ნიშნავს: შემდეგი PRINT ახალ სტრიქონზე არ გადავა და იმავე სტრიქონზე გააგრძელებს ბეჭდვას.',
    sComma: 'მძიმე ნიშნავს „გადახტი“: რაც მის შემდეგ წერია, ეკრანის შემდეგ ნახევარში დაიბეჭდება (ეკრანი ორ ნახევრად იყოფა, თითოში 16 სვეტია).',
    sApos: 'აპოსტროფი ნიშნავს: გადადი ახალ სტრიქონზე.',
    sAtComma: 'ეს მძიმე სტრიქონის ნომერს სვეტის ნომრისგან ყოფს.',
    sArgComma: 'მძიმე ერთმანეთისგან ყოფს რიცხვებს, რომლებიც ამ ბრძანებას სჭირდება.',
    sLetEq: 'აქ = ნიშნავს „ჩაწერე“: მარჯვნივ მდგომი მნიშვნელობა ჩაიწერება მარცხნივ მდგომ ცვლადში.',
    sForEq: 'აქ = მთვლელს საწყის მნიშვნელობას აძლევს.',
    sInSemi: 'წერტილ-მძიმე ნიშნავს: პასუხი კითხვის გვერდით აიკრიფება.',
    sInComma: 'მძიმე ნიშნავს: პასუხი ეკრანის შემდეგ ნახევარში აიკრიფება.',
    kText: 'ტექსტი ბრჭყალებში.',
    kNum: 'რიცხვი.',
    kVar: 'ცვლადი {0}. ცვლადი არის ყუთი, რომელსაც სახელი აქვს და რომელშიც რიცხვი ინახება.',
    kSVar: 'ტექსტური ცვლადი {0}. მასში ტექსტი ინახება; სახელის ბოლოს $ სწორედ ამას ნიშნავს.',
    kCalc: 'გამოთვლა. Spectrum ჯერ პასუხს გამოითვლის.',
    kUses: 'გამოთვლაში გამოიყენება ის, რაც ინახება ცვლადში {0}.',
    xText: 'ეკრანზე დაიბეჭდება ზუსტად ისე, როგორც წერია, შუალედებიანად. თვითონ ბრჭყალები არ იბეჭდება.',
    xNum: 'ეკრანზე ეს რიცხვი დაიბეჭდება.',
    xVar: 'ეკრანზე დაიბეჭდება ის, რაც ცვლადში ინახება, და არა ცვლადის სახელი.',
    xCalc: 'ეკრანზე პასუხი დაიბეჭდება.',
    oAdd: '<code>+</code> ნიშნავს მიმატებას (ტექსტებს კი ერთმანეთს აბამს).',
    oSub: '<code>-</code> ნიშნავს გამოკლებას ან უარყოფით რიცხვს.',
    oMul: '<code>*</code> ნიშნავს გამრავლებას.',
    oDiv: '<code>/</code> ნიშნავს გაყოფას.',
    oPow: '<code>^</code> ნიშნავს ხარისხში აყვანას.',
    oLt: '<code>&lt;</code> ნიშნავს „ნაკლებია“.',
    oGt: '<code>&gt;</code> ნიშნავს „მეტია“.',
    oLe: '<code>&lt;=</code> ნიშნავს „ნაკლებია ან ტოლია“.',
    oGe: '<code>&gt;=</code> ნიშნავს „მეტია ან ტოლია“.',
    oNe: '<code>&lt;&gt;</code> ნიშნავს „არ უდრის“.',
    oEq: '<code>=</code> აქ ნიშნავს „უდრის“.',
    oBr: 'ფრჩხილებში <code>( )</code> ჩაწერილი ნაწილი პირველი გამოითვლება. ფუნქციის შემდეგ ფრჩხილებში ის წერია, რაზეც ფუნქცია მუშაობს.',
    oAnd: '<code>AND</code> ნიშნავს „და“: ორივე პირობა უნდა სრულდებოდეს.',
    oOr: '<code>OR</code> ნიშნავს „ან“: საკმარისია, ერთი პირობა სრულდებოდეს.',
    oNot: '<code>NOT</code> ნიშნავს „არა“: პირობას საპირისპიროდ აქცევს.',
    fVAL: 'VAL ტექსტს რიცხვად აქცევს (მაგალითად, "12" ხდება 12).',
    fSTR: 'STR$ რიცხვს ტექსტად აქცევს.',
    fCODE: 'CODE გვაძლევს სიმბოლოს კოდს (ნომერს).',
    fPEEK: 'PEEK კითხულობს რიცხვს კომპიუტერის მეხსიერებიდან.',
    fOther: '{0} BASIC-ის მზა ფუნქციაა.',
    kAT: 'AT მიუთითებს, ეკრანის რომელ ადგილას დაიბეჭდოს. ჯერ სტრიქონის ნომერი იწერება, მერე სვეტის.',
    kTAB: 'TAB იმავე სტრიქონში მითითებულ სვეტზე გადადის.',
    kInPrint: 'PRINT-ის შიგნით ის მხოლოდ ამ ერთ PRINT-ზე მოქმედებს.',
    rRow: 'სტრიქონის ნომერი: 0 ეკრანის ყველაზე ზედა სტრიქონია, 21 ყველაზე ქვედა.',
    rCol: 'სვეტის ნომერი: 0 ეკრანის მარცხენა კიდეა, 31 მარჯვენა.',
    rTabCol: 'სვეტის ნომერი (0-დან 31-მდე).',
    rLetName: 'ცვლადის სახელი. მნიშვნელობა ამ ცვლადში ჩაიწერება.',
    rLetNameS: 'ცვლადის სახელი. მნიშვნელობა ამ ცვლადში ჩაიწერება. სახელის ბოლოს $ ნიშნავს, რომ მასში ტექსტი ინახება.',
    rLetVal: 'მნიშვნელობა, რომელიც ცვლადში ჩაიწერება.',
    rAsk: 'კითხვა, რომელსაც Spectrum ეკრანზე აჩვენებს და პასუხს ელოდება. ბრჭყალები ეკრანზე არ ჩანს.',
    rInNum: 'ცვლადი, რომელშიც შენი პასუხი ჩაიწერება. სახელს $ არ აქვს, ამიტომ პასუხი რიცხვი უნდა იყოს.',
    rInText: 'ტექსტური ცვლადი, რომელშიც შენი პასუხი ჩაიწერება. $ ნიშნავს, რომ ნებისმიერი ტექსტი შეგიძლია აკრიფო.',
    rCond: 'პირობა, რომელსაც Spectrum ამოწმებს. ის ან სრულდება, ან არ სრულდება.',
    kTHEN: 'THEN ნიშნავს „მაშინ“: რაც მის შემდეგ წერია, მხოლოდ მაშინ შესრულდება, თუ პირობა სრულდება.',
    rForVar: 'მთვლელი: ცვლადი, რომელიც ციკლის ყოველ გამეორებაზე იცვლება.',
    rFrom: 'რიცხვი, საიდანაც თვლა იწყება.',
    kTO: 'TO ნიშნავს „-მდე“: თვლა გრძელდება მის შემდეგ დაწერილ რიცხვამდე (ამ რიცხვის ჩათვლით).',
    rTo: 'რიცხვი, რომელზეც თვლა მთავრდება.',
    kSTEP: 'STEP ნიშნავს „ბიჯი“: რამდენით იცვლება მთვლელი ყოველ გამეორებაზე. თუ STEP არ წერია, მთვლელი 1-ით იზრდება.',
    rStep: 'რამდენი ემატება მთვლელს ყოველ გამეორებაზე (უარყოფითი რიცხვის შემთხვევაში თვლა უკუღმა მიდის).',
    rNextVar: 'ციკლის მთვლელი. აქ იგივე ცვლადი უნდა ეწეროს, რაც FOR-ში.',
    rLineNo: 'ხაზის ნომერი, რომელზეც პროგრამა გადავა.',
    rColour: 'ფერის ნომერი: {0}.',
    rColourAny: 'ფერის ნომერი, 0-დან 7-მდე (0 შავი, 1 ლურჯი, 2 წითელი, 3 იისფერი, 4 მწვანე, 5 ცისფერი, 6 ყვითელი, 7 თეთრი).',
    rOnOff: '1 ნიშნავს ჩართვას, 0 გამორთვას.',
    rX: 'ჰორიზონტალური მდებარეობა: 0 ეკრანის მარცხენა კიდეა, 255 მარჯვენა.',
    rY: 'ვერტიკალური მდებარეობა: 0 ეკრანის ქვედა კიდეა, 175 ზედა.',
    rDx: 'რამდენი წერტილით მარჯვნივ (უარყოფითი რიცხვი ნიშნავს მარცხნივ).',
    rDy: 'რამდენი წერტილით ზევით (უარყოფითი რიცხვი ნიშნავს ქვევით).',
    rBend: 'რამდენად მოიხაროს ხაზი (კუთხე).',
    rCx: 'წრის ცენტრის ჰორიზონტალური მდებარეობა.',
    rCy: 'წრის ცენტრის ვერტიკალური მდებარეობა.',
    rRadius: 'რადიუსი: მანძილი წრის ცენტრიდან კიდემდე.',
    rSecs: 'ნოტის ხანგრძლივობა წამებში.',
    rPitch: 'ნოტის სიმაღლე: 0 არის პირველი ოქტავის „დო“; ყოველი 1 ფორტეპიანოს ერთი კლავიშით მაღალია, უარყოფითი რიცხვები კი უფრო დაბალი ნოტებია.',
    rWait: 'ლოდინის დრო: 50 ერთი წამია. 0 ნიშნავს ლოდინს მანამ, სანამ კლავიშს არ დააჭერ.',
    rAddr: 'მეხსიერების მისამართი.',
    rPokeVal: 'რიცხვი, რომელიც იქ ჩაიწერება (0-დან 255-მდე).',
    rDim: 'მასივის სახელი; ფრჩხილებში წერია, რამდენი ყუთი აქვს.',
    rReadVar: 'ცვლადი, რომელშიც DATA-ს შემდეგი მნიშვნელობა ჩაიწერება.',
    rDataVal: 'სიის ერთ-ერთი მნიშვნელობა.',
    rName: 'პროგრამის სახელი კასეტაზე.',
    rRemText: 'თვითონ შენიშვნა. აქ ნებისმიერი რამ შეგიძლია დაწერო; Spectrum ამას არ კითხულობს.',
    rValue: 'მნიშვნელობა, რომელიც ამ ბრძანებას სჭირდება.',
    kw: {
      REM: 'REM ნიშნავს „შენიშვნა“. ეს ჩანაწერია ადამიანებისთვის; Spectrum ხაზის დანარჩენ ნაწილს არ ასრულებს.',
      PRINT: 'PRINT ნიშნავს „დაბეჭდე“: რაც მის შემდეგ წერია, ეკრანზე გამოჩნდება.',
      LET: 'LET მნიშვნელობას ცვლადში წერს.',
      INPUT: 'INPUT ელოდება, სანამ პასუხს აკრეფ და Enter-ს დააჭერ.',
      IF: 'IF ნიშნავს „თუ“: მის შემდეგ პირობა წერია.',
      FOR: 'FOR იწყებს ციკლს: მის შემდეგ დაწერილი ხაზები რამდენჯერმე მეორდება.',
      NEXT: 'NEXT ციკლის ბოლოა: პროგრამა FOR-თან ბრუნდება შემდეგი გამეორებისთვის.',
      GOTO: 'GO TO ნიშნავს „გადადი“: პროგრამა სხვა ხაზზე გადადის.',
      GOSUB: 'GO SUB ქვეპროგრამაზე გადადის და იმახსოვრებს, სად უნდა დაბრუნდეს.',
      BORDER: 'BORDER ცვლის ეკრანის ჩარჩოს ფერს.',
      PAPER: 'PAPER ცვლის ფონის ფერს.',
      INK: 'INK ცვლის ასოებისა და ნახაზის ფერს.',
      BRIGHT: 'BRIGHT ფერებს უფრო კაშკაშას ხდის.',
      FLASH: 'FLASH ნაბეჭდს აციმციმებს.',
      INVERSE: 'INVERSE ასოებისა და ფონის ფერებს ადგილებს უცვლის.',
      OVER: 'OVER ახალს ძველის ზემოდან ბეჭდავს, ძველის წაშლის გარეშე.',
      PLOT: 'PLOT ეკრანზე ერთ წერტილს სვამს.',
      DRAW: 'DRAW ხაზს ავლებს ბოლო წერტილიდან.',
      CIRCLE: 'CIRCLE წრეს ხატავს.',
      BEEP: 'BEEP ნოტს უკრავს.',
      PAUSE: 'PAUSE პროგრამას ცოტა ხნით აჩერებს.',
      DIM: 'DIM ქმნის მასივს, ანუ დანომრილი ყუთების რიგს.',
      READ: 'READ მნიშვნელობებს DATA-ს სიიდან იღებს.',
      DATA: 'DATA-ში წერია მნიშვნელობების სია READ-ისთვის.',
      POKE: 'POKE რიცხვს პირდაპირ კომპიუტერის მეხსიერებაში წერს.',
      SAVE: 'SAVE პროგრამას კასეტაზე ინახავს.',
      LOAD: 'LOAD პროგრამას კასეტიდან კითხულობს.',
      DEFFN: 'DEF FN შენს საკუთარ ფუნქციას განსაზღვრავს.',
      OUT: 'OUT რიცხვს აპარატურის პორტში აგზავნის.',
    },
  },
};
for (const l of ['en', 'ka']) Object.assign(T[l], X[l]);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const codeTag = s => `<code>${esc(String(s).trim())}</code>`;
const fill = (text, ...a) => text.replace(/\{(\d)\}/g, (_, i) => a[i] ?? '');

// Splits at separator characters outside quotes and brackets. Each entry keeps the separator after it.
function splitKeep(s, seps) {
  const out = [];
  let cur = '', depth = 0, inQ = false;
  for (const ch of s) {
    if (ch === '"') inQ = !inQ;
    if (!inQ) { if (ch === '(') depth++; else if (ch === ')') depth--; }
    if (!inQ && depth <= 0 && seps.includes(ch)) { out.push({ t: cur, sep: ch }); cur = ''; } else cur += ch;
  }
  out.push({ t: cur, sep: '' });
  return out;
}
const splitTop = (s, seps) => splitKeep(s, seps).map(x => x.t);
// Position of a word outside quotes, or -1.
function findWord(s, word) {
  let inQ = false;
  const up = s.toUpperCase();
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"') inQ = !inQ;
    if (!inQ && up.startsWith(word, i) && !/[A-Z0-9]/.test(up[i - 1] || ' ') && !/[A-Z0-9$]/.test(up[i + word.length] || ' ')) return i;
  }
  return -1;
}

// ---------- what kind of value is this? ----------
const NUM = /^-?\s*(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
const WORD = /^[A-Za-z][A-Za-z0-9]*\$?$/;
const TOKEN = /"[^"]*"?|(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[A-Za-z][A-Za-z0-9]*\$?|<=|>=|<>|[-+*\/^<>=(]/g;
const NOTE = {
  '+': 'oAdd', '-': 'oSub', '*': 'oMul', '/': 'oDiv', '^': 'oPow', '<': 'oLt', '>': 'oGt', '<=': 'oLe', '>=': 'oGe', '<>': 'oNe', '=': 'oEq', '(': 'oBr',
  AND: 'oAnd', OR: 'oOr', NOT: 'oNot', RND: 'fRND', INT: 'fINT', INKEY$: 'fINKEY', SQR: 'fSQR', ABS: 'fABS', LEN: 'fLEN', PI: 'fPI', SIN: 'fSIN', COS: 'fSIN',
  CHR$: 'fCHR', VAL: 'fVAL', STR$: 'fSTR', CODE: 'fCODE', PEEK: 'fPEEK',
};
const BUILTIN = new Set(['TAN', 'ASN', 'ACS', 'ATN', 'LN', 'EXP', 'SGN', 'USR', 'IN', 'ATTR', 'POINT', 'SCREEN$', 'VAL$', 'FN', 'BIN']);
const IGNORE = new Set(['TO', 'STEP', 'THEN', 'LINE', 'AT', 'TAB']);

function describe(e, L) {
  const s = e.trim(), up = s.toUpperCase();
  if (/^"[^"]*"?$/.test(s)) return { kind: 'Text', html: L.kText };
  if (NUM.test(s)) return { kind: 'Num', html: L.kNum };
  if (WORD.test(s) && !NOTE[up] && !BUILTIN.has(up)) return { kind: 'Var', html: fill(s.endsWith('$') ? L.kSVar : L.kVar, codeTag(s)) };
  const notes = [], seen = new Set(), vars = [];
  for (const tok of s.match(TOKEN) || []) {
    const u = tok.toUpperCase();
    if (tok[0] === '"' || /^[\d.]/.test(tok) || IGNORE.has(u)) continue;
    if (NOTE[u]) { if (!seen.has(NOTE[u])) { seen.add(NOTE[u]); notes.push(L[NOTE[u]]); } }
    else if (BUILTIN.has(u)) { if (!seen.has(u)) { seen.add(u); notes.push(fill(L.fOther, codeTag(u))); } }
    else if (/^[A-Za-z]/.test(tok) && !vars.includes(tok)) vars.push(tok);
  }
  if (vars.length) notes.unshift(fill(L.kUses, vars.map(codeTag).join(', ')));
  return { kind: 'Calc', html: (WORD.test(s) ? notes : [L.kCalc, ...notes]).join(' ') };
}

const ROLES = {
  PLOT: ['rX', 'rY'], DRAW: ['rDx', 'rDy', 'rBend'], CIRCLE: ['rCx', 'rCy', 'rRadius'], BEEP: ['rSecs', 'rPitch'], PAUSE: ['rWait'], POKE: ['rAddr', 'rPokeVal'],
  NEXT: ['rNextVar'], GOTO: ['rLineNo'], GOSUB: ['rLineNo'], BORDER: ['rColour'], PAPER: ['rColour'], INK: ['rColour'],
  BRIGHT: ['rOnOff'], FLASH: ['rOnOff'], INVERSE: ['rOnOff'], OVER: ['rOnOff'], SAVE: ['rName'], LOAD: ['rName'],
};
const REPEAT = { READ: 'rReadVar', DATA: 'rDataVal', DIM: 'rDim' };
const PLAIN = new Set(['rNextVar', 'rReadVar', 'rDim', 'rName', 'rLineNo']);   // the role says it all

// Explains one instruction. Returns { part: summary html, pieces: [[code html, explanation html]] }.
function explainStatement(stmt, L) {
  const s = stmt.trim();
  const tr = (key, ...args) => fill(L[key], ...args);
  if (!s) return null;
  const m = /^(GO\s*TO|GO\s*SUB|DEF\s*FN|[A-Za-z]+)\s*(.*)$/s.exec(s);
  const kw = m ? m[1].toUpperCase().replace(/\s+/g, '') : '';
  const shown = { GOTO: 'GO TO', GOSUB: 'GO SUB', DEFFN: 'DEF FN' }[kw] || kw;
  const rest = m ? m[2].trim() : '';
  const colourName = v => (/^\d$/.test(v.trim()) && (Number(v) < 8 || kw !== 'BORDER') ? `${esc(L.colours[Number(v)])} (${Number(v)})` : null);
  const colour = v => colourName(v) || codeTag(v);
  const args = splitTop(rest, ',').map(a => a.trim());
  const pieces = [];
  const word = (w, text) => pieces.push([codeTag(w), text]);
  // One value with its role, e.g. "How far across … A number."
  const value = (e, role) => {
    if (!e.trim()) return;
    if (role === 'rColour') {
      const name = colourName(e);
      return pieces.push([codeTag(e), name ? tr('rColour', name) : `${L.rColourAny} ${describe(e, L).html}`]);
    }
    pieces.push([codeTag(e), PLAIN.has(role) ? L[role] : `${L[role]} ${describe(e, L).html}`]);
  };
  const argList = (text, roleAt) => splitKeep(text, ',').forEach((it, i) => {
    value(it.t, roleAt(i));
    if (it.sep) word(',', L.sArgComma);
  });
  const keyword = () => word(shown, L.kw[kw] || L[kw]);
  let out;
  switch (kw) {
    case 'REM':
      keyword();
      if (rest) pieces.push([codeTag(rest), L.rRemText]);
      return { part: L.REM, pieces };
    case 'PRINT': {
      keyword();
      if (!rest) return { part: L.printEmpty, pieces };
      const items = [], list = splitKeep(rest, ";,'");
      let comma = false, wantCol = false;
      list.forEach((it, i) => {
        const x = it.t.trim(), isCol = wantCol;
        wantCol = false;
        let mm, wasAt = false;
        if (x && isCol) { value(x, 'rCol'); items[items.length - 1] = tr('pAt', items[items.length - 1], codeTag(x)); }
        else if (x && (mm = /^AT\s*(.*)$/is.exec(x))) { wasAt = true; word('AT', L.kAT); value(mm[1], 'rRow'); items.push(codeTag(mm[1])); }
        else if (x && (mm = /^TAB\s*(.*)$/is.exec(x))) { word('TAB', L.kTAB); value(mm[1], 'rTabCol'); items.push(tr('pTab', codeTag(mm[1]))); }
        else if (x && (mm = /^(INK|PAPER|BRIGHT|FLASH|INVERSE|OVER)\s*(.*)$/is.exec(x))) {
          const k = mm[1].toUpperCase();
          word(k, `${L.kw[k]} ${L.kInPrint}`);
          value(mm[2], k === 'INK' || k === 'PAPER' ? 'rColour' : 'rOnOff');
          items.push(tr('pColour', codeTag(x)));
        } else if (x) {
          const d = describe(x, L);
          pieces.push([codeTag(x), `${d.html} ${L['x' + d.kind]}`]);
          items.push(tr(d.kind === 'Text' ? 'pText' : 'pValue', codeTag(x)));
        }
        if (!it.sep) return;
        if (it.sep === ',' && wasAt) { wantCol = true; return word(',', L.sAtComma); }
        const atEnd = list.slice(i + 1).every(n => !n.t.trim());
        if (it.sep === ',') comma = true;
        word(it.sep, it.sep === ';' ? (atEnd ? L.sSemiEnd : L.sSemi) : it.sep === ',' ? L.sComma : L.sApos);
      });
      out = items.length ? tr('print', items.join(L.then)) : L.printEmpty;
      if (rest.endsWith(';')) out += ' ' + L.printStay;
      else if (comma) out += ' ' + L.printComma;
      break;
    }
    case 'LET': {
      const eq = splitTop(rest, '=');
      const name = eq[0].trim(), val = rest.slice(eq[0].length + 1);
      keyword();
      if (name) pieces.push([codeTag(name), name.endsWith('$') ? L.rLetNameS : L.rLetName]);
      if (eq.length > 1) word('=', L.sLetEq);
      value(val, 'rLetVal');
      out = tr(name.endsWith('$') ? 'letText' : /^\s*-?[\d.]+\s*$/.test(val) ? 'letPut' : 'let', codeTag(name), codeTag(val));
      break;
    }
    case 'INPUT': {
      keyword();
      const ask = [], vars = [];
      for (const it of splitKeep(rest, ';,')) {
        const x = it.t.trim();
        if (x.startsWith('"')) { ask.push(x); pieces.push([codeTag(x), L.rAsk]); }
        else if (x) { vars.push(x); pieces.push([codeTag(x), x.endsWith('$') ? L.rInText : L.rInNum]); }
        if (it.sep) word(it.sep, it.sep === ';' ? L.sInSemi : L.sInComma);
      }
      out = tr('input', vars.map(codeTag).join(', '));
      if (ask.length) out += ' ' + tr('inputAsk', codeTag(ask[0]));
      break;
    }
    case 'IF': {
      const at = findWord(rest, 'THEN');
      const cond = at < 0 ? rest : rest.slice(0, at), body = at < 0 ? '' : rest.slice(at + 4);
      keyword();
      if (cond.trim()) pieces.push([codeTag(cond), `${L.rCond} ${describe(cond, L).html.replace(L.kCalc + ' ', '')}`]);
      if (at >= 0) word('THEN', L.kTHEN);
      const inner = explainStatements(body, L);
      pieces.push(...inner.pieces);
      return { part: `${tr('if', codeTag(cond))}<ul>${inner.parts.map(x => `<li>${x}</li>`).join('')}</ul>${L.ifElse}`, pieces };
    }
    case 'FOR': {
      const eq = rest.indexOf('='), to = findWord(rest, 'TO'), st = findWord(rest, 'STEP');
      const v = eq < 0 ? rest : rest.slice(0, eq), from = eq < 0 ? '' : rest.slice(eq + 1, to < 0 ? undefined : to);
      const end = to < 0 ? '' : rest.slice(to + 2, st < 0 ? undefined : st);
      keyword();
      if (v.trim()) pieces.push([codeTag(v), L.rForVar]);
      if (eq >= 0) word('=', L.sForEq);
      value(from, 'rFrom');
      if (to >= 0) { word('TO', L.kTO); value(end, 'rTo'); }
      if (st >= 0) { word('STEP', L.kSTEP); value(rest.slice(st + 4), 'rStep'); }
      out = st < 0 ? tr('for', codeTag(v), codeTag(from), codeTag(end)) : tr('forStep', codeTag(v), codeTag(from), codeTag(end), codeTag(rest.slice(st + 4)));
      break;
    }
    case 'GOTO': out = tr('goto', codeTag(rest)); break;
    case 'GOSUB': out = tr('gosub', codeTag(rest)); break;
    case 'BORDER': case 'PAPER': case 'INK': out = tr(kw, colour(rest)); break;
    case 'DRAW': out = args.length > 2 ? tr('drawArc', ...args.map(codeTag)) : tr('DRAW', ...args.map(codeTag)); break;
    case 'PLOT': case 'CIRCLE': case 'BEEP': case 'POKE':
      out = tr(kw, ...args.map(codeTag)); break;
    case 'NEXT': case 'BRIGHT': case 'FLASH': case 'INVERSE': case 'OVER': case 'PAUSE': case 'DIM': case 'READ': case 'DATA': case 'SAVE': case 'OUT':
      out = tr(kw, codeTag(rest)); break;
    case 'DEFFN': out = tr('DEFFN', codeTag(rest)); break;
    case 'RETURN': case 'CLS': case 'RANDOMIZE': case 'RESTORE': case 'STOP': case 'CLEAR': case 'RUN': case 'LIST': case 'NEW': case 'LOAD': case 'CONTINUE': case 'COPY':
      out = L[kw]; break;
    default:
      if (/^[A-Za-z][A-Za-z0-9]*\$?\s*(\([^)]*\))?\s*=/.test(s)) return { part: tr('noLet', codeTag('LET ' + s)), pieces };
      return { part: tr('unknown', codeTag(s)), pieces };
  }
  if (!pieces.length) {   // instructions whose values are a plain list
    keyword();
    if (kw === 'DEFFN') { if (rest) pieces.push([codeTag(rest), L.rValue]); }
    else argList(rest, i => REPEAT[kw] || (ROLES[kw] || [])[i] || 'rValue');
  }
  return { part: out, pieces };
}

// Explains a run of instructions separated by colons. IF takes the rest of the line.
function explainStatements(text, L) {
  const list = splitTop(text, ':');
  const parts = [], pieces = [];
  const add = r => { if (!r) return; if (parts.length) pieces.push([codeTag(':'), L.sColon]); parts.push(r.part); pieces.push(...r.pieces); };
  for (let i = 0; i < list.length; i++) {
    const p = list[i].trim();
    if (!p) continue;
    if (/^(REM|IF)(\s|$)/i.test(p)) { add(explainStatement(list.slice(i).join(':'), L)); break; }
    add(explainStatement(p, L));
  }
  return { parts, pieces };
}

// parts: one summary per instruction. pieces: every item on the line, in order, with what it means.
export function explainLine(text, lang = 'en') {
  const L = T[lang] || T.en;
  if (!text.trim()) return null;
  const m = /^\s*(\d+)\s*(.*)$/s.exec(text);
  if (!m) return { num: null, parts: [L.noNumber], pieces: [] };
  const r = explainStatements(m[2], L);
  return { num: m[1], parts: r.parts.length ? r.parts : [L.empty], pieces: [[codeTag(m[1]), L.lineNum], ...r.pieces] };
}
