// Lessons for the "Learn BASIC" tab, in English (en) and Georgian (ka).
// `text` is trusted HTML written here. `lines` is the program: [code, English explanation, Georgian explanation].
export const LESSONS = [
  {
    title: { en: '1. Lines and line numbers', ka: '1. ხაზები და ხაზის ნომრები' },
    text: {
      en: `<p>A BASIC program is a list of instructions. Every instruction sits on its own line, and every line starts with a <strong>line number</strong>.</p>
<p>The Spectrum runs the lines in number order, lowest first. The number is only an order and a name for the line; it is not printed.</p>
<p>Programmers count in tens (10, 20, 30) so there is room to add a line in between later, for example line 15.</p>
<p>When the program ends, the Spectrum shows a report at the bottom: <code>0 OK, 20:1</code> means "finished with no error; the last line was 20".</p>`,
      ka: `<p>BASIC-ის პროგრამა ბრძანებების სიაა. თითოეული ბრძანება ცალკე ხაზზე წერია და ყველა ხაზი <strong>ხაზის ნომრით</strong> იწყება.</p>
<p>Spectrum ხაზებს ნომრების მიხედვით ასრულებს, ყველაზე პატარიდან დაწყებული. ნომერი მხოლოდ რიგს და ხაზის სახელს აღნიშნავს; ის ეკრანზე არ იბეჭდება.</p>
<p>პროგრამისტები ათეულებით ითვლიან (10, 20, 30), რომ მოგვიანებით შუაში ახალი ხაზის ჩამატება შეიძლებოდეს, მაგალითად ხაზი 15.</p>
<p>როცა პროგრამა მთავრდება, Spectrum ქვემოთ აჩვენებს შეტყობინებას: <code>0 OK, 20:1</code> ნიშნავს „დასრულდა შეცდომის გარეშე; ბოლო ხაზი იყო 20“.</p>`,
    },
    lines: [
      ['10 PRINT "Line ten runs first"', '10 is the line number. PRINT shows the text inside the quotes on the screen. This line runs first because 10 is the lowest number.', '10 ხაზის ნომერია. PRINT ეკრანზე გამოაქვს ბრჭყალებში ჩაწერილი ტექსტი. ეს ხაზი პირველი სრულდება, რადგან 10 ყველაზე პატარა ნომერია.'],
      ['20 PRINT "Line twenty runs second"', '20 is bigger than 10, so this line runs next. It prints its text on a new row.', '20 მეტია 10-ზე, ამიტომ ეს ხაზი შემდეგ სრულდება. ის თავის ტექსტს ახალ სტრიქონზე ბეჭდავს.'],
    ],
  },
  {
    title: { en: '2. REM: notes for humans', ka: '2. REM: შენიშვნები ადამიანებისთვის' },
    text: {
      en: `<p><code>REM</code> is short for <strong>remark</strong>. The Spectrum ignores everything after REM on that line. It is a note for the person reading the program.</p>
<p>Use REM to give the program a title or to explain a tricky part.</p>`,
      ka: `<p><code>REM</code> არის სიტყვა <strong>remark</strong>-ის (შენიშვნა) შემოკლება. Spectrum ამ ხაზზე REM-ის შემდეგ დაწერილს არ ასრულებს. ეს ჩანაწერია იმ ადამიანისთვის, ვინც პროგრამას კითხულობს.</p>
<p>გამოიყენე REM, რომ პროგრამას სათაური დაარქვა ან რთული ადგილი ახსნა.</p>`,
    },
    lines: [
      ['10 REM This program says hello', 'REM means remark. The Spectrum skips this line; it is a note telling people what the program is for.', 'REM ნიშნავს შენიშვნას. Spectrum ამ ხაზს გამოტოვებს; ეს ჩანაწერი ადამიანს უხსნის, რისთვის არის პროგრამა.'],
      ['20 PRINT "Hello!"', 'Prints Hello! on the screen.', 'ეკრანზე ბეჭდავს Hello!'],
      ['30 REM The next line prints a sum', 'Another remark. Nothing happens on the screen.', 'კიდევ ერთი შენიშვნა. ეკრანზე არაფერი ხდება.'],
      ['40 PRINT 2+3', 'There are no quotes, so the Spectrum works out 2+3 and prints the answer, 5.', 'ბრჭყალები არ არის, ამიტომ Spectrum ითვლის 2+3-ს და ბეჭდავს პასუხს: 5.'],
    ],
  },
  {
    title: { en: '3. PRINT: showing things', ka: '3. PRINT: ეკრანზე გამოტანა' },
    text: {
      en: `<p><code>PRINT</code> puts something on the screen.</p>
<ul><li>Text goes inside quotes and is printed exactly as written.</li>
<li>Without quotes the Spectrum works out the answer first.</li>
<li>A semicolon <code>;</code> joins things on the same row with no gap. A comma <code>,</code> jumps to the middle of the screen.</li></ul>
<p>Sums use <code>+</code> <code>-</code> <code>*</code> (times) and <code>/</code> (divide).</p>`,
      ka: `<p><code>PRINT</code> რაღაცას ეკრანზე გამოიტანს.</p>
<ul><li>ტექსტი ბრჭყალებში იწერება და ზუსტად ისე იბეჭდება, როგორც დაწერილია.</li>
<li>ბრჭყალების გარეშე Spectrum ჯერ პასუხს გამოითვლის.</li>
<li>წერტილ-მძიმე <code>;</code> ორ რამეს ერთ სტრიქონზე უშუალოდ ერთმანეთის გვერდით ბეჭდავს. მძიმე <code>,</code> ეკრანის შუაში გადადის.</li></ul>
<p>მოქმედებებია <code>+</code> <code>-</code> <code>*</code> (გამრავლება) და <code>/</code> (გაყოფა).</p>`,
    },
    lines: [
      ['10 PRINT "Hello"', 'Prints the word Hello exactly as written.', 'ბეჭდავს სიტყვას Hello ზუსტად ისე, როგორც წერია.'],
      ['20 PRINT 6*7', 'The star means times. The Spectrum works out 6 times 7 and prints 42.', 'ვარსკვლავი გამრავლებას ნიშნავს. Spectrum ითვლის 6-ჯერ 7-ს და ბეჭდავს 42-ს.'],
      ['30 PRINT "6 times 7 is ";6*7', 'Prints the text, then the semicolon puts the answer 42 right after it on the same row.', 'ბეჭდავს ტექსტს, შემდეგ კი წერტილ-მძიმის გამო პასუხი 42 იმავე სტრიქონზე მის გვერდით იწერება.'],
      ['40 PRINT', 'PRINT with nothing after it leaves an empty row.', 'PRINT, რომელსაც არაფერი მოსდევს, ცარიელ სტრიქონს ტოვებს.'],
      ['50 PRINT "left","right"', 'Prints left, then the comma moves to the middle of the screen before printing right.', 'ბეჭდავს left-ს, შემდეგ მძიმე ეკრანის შუაში გადადის და იქ ბეჭდავს right-ს.'],
    ],
  },
  {
    title: { en: '4. LET: remembering values', ka: '4. LET: მნიშვნელობების დამახსოვრება' },
    text: {
      en: `<p>A <strong>variable</strong> is a named box that holds a value. <code>LET</code> puts a value in the box.</p>
<p>A box for a number can have any name. A box for text has a one-letter name ending in <code>$</code>.</p>
<p>If you use a variable before giving it a value, the Spectrum stops with the report <code>2 Variable not found</code>.</p>`,
      ka: `<p><strong>ცვლადი</strong> სახელიანი ყუთია, რომელშიც მნიშვნელობა ინახება. <code>LET</code> ყუთში მნიშვნელობას დებს.</p>
<p>რიცხვის ყუთს ნებისმიერი სახელი შეიძლება ერქვას. ტექსტის ყუთის სახელი ერთი ასოა, რომელსაც ბოლოში <code>$</code> აქვს.</p>
<p>თუ ცვლადს გამოიყენებ მანამ, სანამ მნიშვნელობას მისცემ, Spectrum გაჩერდება შეტყობინებით <code>2 Variable not found</code> (ცვლადი ვერ მოიძებნა).</p>`,
    },
    lines: [
      ['10 LET n$="Anna"', 'Makes a text box called n$ and puts the name Anna in it. The $ sign means the box holds text.', 'ქმნის ტექსტის ყუთს სახელად n$ და მასში დებს სახელს Anna. ნიშანი $ ნიშნავს, რომ ყუთში ტექსტი ინახება.'],
      ['20 LET age=12', 'Makes a number box called age and puts 12 in it.', 'ქმნის რიცხვის ყუთს სახელად age და მასში დებს 12-ს.'],
      ['30 PRINT n$;" is ";age', 'Prints what is in n$, then the word is, then what is in age. The screen shows: Anna is 12', 'ბეჭდავს იმას, რაც n$-შია, შემდეგ სიტყვას is, შემდეგ იმას, რაც age-შია. ეკრანზე გამოჩნდება: Anna is 12'],
      ['40 LET age=age+1', 'Takes the number in age (12), adds 1 and stores the result (13) back in age.', 'იღებს age-ში შენახულ რიცხვს (12), უმატებს 1-ს და შედეგს (13) ისევ age-ში ინახავს.'],
      ['50 PRINT "Next year: ";age', 'Prints the text and the new value of age, which is 13.', 'ბეჭდავს ტექსტს და age-ის ახალ მნიშვნელობას, ანუ 13-ს.'],
    ],
  },
  {
    title: { en: '5. INPUT: asking a question', ka: '5. INPUT: კითხვის დასმა' },
    text: {
      en: `<p><code>INPUT</code> stops the program and waits for the person to type something, then stores it in a variable.</p>
<p>After the program starts, click the Spectrum screen, type your answer and press Enter. The question appears at the bottom of the screen.</p>`,
      ka: `<p><code>INPUT</code> პროგრამას აჩერებს და ელოდება, სანამ ადამიანი რამეს აკრეფს, შემდეგ კი აკრეფილს ცვლადში ინახავს.</p>
<p>პროგრამის გაშვების შემდეგ დააწკაპუნე Spectrum-ის ეკრანზე, აკრიფე პასუხი და დააჭირე Enter-ს. კითხვა ეკრანის ქვედა ნაწილში ჩანს.</p>`,
    },
    lines: [
      ['10 INPUT "What is your name? ";n$', 'Shows the question at the bottom of the screen and waits. What you type goes into the text box n$ when you press Enter.', 'ეკრანის ქვემოთ აჩვენებს კითხვას და ელოდება. რასაც აკრეფ, Enter-ის დაჭერისას ტექსტის ყუთში n$ ჩაიწერება.'],
      ['20 INPUT "How old are you? ";age', 'Asks a second question and stores the number you type in age.', 'სვამს მეორე კითხვას და შენ მიერ აკრეფილ რიცხვს age-ში ინახავს.'],
      ['30 PRINT "Hello, ";n$', 'Prints Hello, followed by the name you typed.', 'ბეჭდავს Hello, და მის შემდეგ შენ მიერ აკრეფილ სახელს.'],
      ['40 PRINT "In ten years you will be ";age+10', 'Adds 10 to your age and prints the result after the text.', 'შენს ასაკს უმატებს 10-ს და შედეგს ტექსტის შემდეგ ბეჭდავს.'],
    ],
  },
  {
    title: { en: '6. IF ... THEN: making decisions', ka: '6. IF ... THEN: გადაწყვეტილების მიღება' },
    text: {
      en: `<p><code>IF</code> tests something. When the test is true, the Spectrum does what comes after <code>THEN</code>. When it is false, it skips to the next line.</p>
<p>The tests are <code>=</code> equal, <code>&lt;</code> less than, <code>&gt;</code> greater than, <code>&lt;&gt;</code> not equal, <code>&lt;=</code> less or equal, <code>&gt;=</code> greater or equal.</p>`,
      ka: `<p><code>IF</code> პირობას ამოწმებს. თუ პირობა სწორია, Spectrum ასრულებს იმას, რაც <code>THEN</code>-ის შემდეგ წერია. თუ არა, გადადის შემდეგ ხაზზე.</p>
<p>შედარებებია: <code>=</code> ტოლია, <code>&lt;</code> ნაკლებია, <code>&gt;</code> მეტია, <code>&lt;&gt;</code> არ უდრის, <code>&lt;=</code> ნაკლებია ან ტოლი, <code>&gt;=</code> მეტია ან ტოლი.</p>`,
    },
    lines: [
      ['10 INPUT "Type a number: ";n', 'Waits for you to type a number and stores it in n.', 'ელოდება, სანამ რიცხვს აკრეფ, და მას n-ში ინახავს.'],
      ['20 IF n>100 THEN PRINT "That is big"', 'Tests whether n is greater than 100. If yes, it prints the message. If no, it skips the rest of this line.', 'ამოწმებს, არის თუ არა n 100-ზე მეტი. თუ კი, ბეჭდავს ტექსტს. თუ არა, ამ ხაზის დანარჩენ ნაწილს გამოტოვებს.'],
      ['30 IF n<=100 THEN PRINT "That is small"', 'Tests whether n is 100 or less. Exactly one of lines 20 and 30 prints.', 'ამოწმებს, არის თუ არა n 100 ან ნაკლები. 20 და 30 ხაზებიდან ზუსტად ერთი დაბეჭდავს.'],
      ['40 IF n=7 THEN PRINT "Lucky seven!"', 'Prints an extra message only when n is exactly 7.', 'დამატებით ტექსტს ბეჭდავს მხოლოდ მაშინ, როცა n ზუსტად 7-ია.'],
    ],
  },
  {
    title: { en: '7. FOR ... NEXT: repeating', ka: '7. FOR ... NEXT: გამეორება' },
    text: {
      en: `<p><code>FOR</code> and <code>NEXT</code> repeat the lines between them. <code>FOR n=1 TO 5</code> runs them five times, with <em>n</em> counting 1, 2, 3, 4, 5.</p>
<p>Add <code>STEP</code> to count differently: <code>FOR n=10 TO 0 STEP -2</code> counts down in twos.</p>`,
      ka: `<p><code>FOR</code> და <code>NEXT</code> მათ შორის მოქცეულ ხაზებს იმეორებს. <code>FOR n=1 TO 5</code> მათ ხუთჯერ ასრულებს და <em>n</em> ითვლის: 1, 2, 3, 4, 5.</p>
<p>სხვანაირად სათვლელად დაამატე <code>STEP</code>: <code>FOR n=10 TO 0 STEP -2</code> ორ-ორით უკან ითვლის.</p>`,
    },
    lines: [
      ['10 FOR n=1 TO 5', 'Starts a loop. n begins at 1. The lines down to NEXT repeat until n has passed 5.', 'იწყებს ციკლს. n იწყება 1-დან. ხაზები NEXT-ამდე მეორდება, სანამ n 5-ს არ გადასცდება.'],
      ['20 PRINT "This is turn ";n', 'Runs once on every turn of the loop and prints the current value of n.', 'ციკლის ყოველ ბრუნზე ერთხელ სრულდება და ბეჭდავს n-ის მიმდინარე მნიშვნელობას.'],
      ['30 NEXT n', 'Adds 1 to n. If n is still 5 or less, it jumps back to the line after FOR. Otherwise the program carries on below.', 'n-ს უმატებს 1-ს. თუ n ჯერ კიდევ 5 ან ნაკლებია, ბრუნდება FOR-ის შემდეგ ხაზზე. თუ არა, პროგრამა ქვემოთ გრძელდება.'],
      ['40 PRINT "Finished"', 'Runs once, after the loop has ended.', 'სრულდება ერთხელ, ციკლის დამთავრების შემდეგ.'],
    ],
  },
  {
    title: { en: '8. GO TO: jumping', ka: '8. GO TO: გადახტომა' },
    text: {
      en: `<p><code>GO TO</code> jumps to another line by its number. This is why line numbers matter.</p>
<p>This program jumps back for ever. To stop it, press the <strong>Break</strong> button (or Esc). If the screen fills up and asks <code>scroll?</code>, press any key to carry on.</p>`,
      ka: `<p><code>GO TO</code> ნომრის მიხედვით სხვა ხაზზე გადადის. სწორედ ამიტომ არის ხაზის ნომრები მნიშვნელოვანი.</p>
<p>ეს პროგრამა უსასრულოდ უკან ბრუნდება. გასაჩერებლად დააჭირე ღილაკს <strong>შეჩერება</strong> (ან Esc). თუ ეკრანი გაივსო და გეკითხება <code>scroll?</code>, გასაგრძელებლად დააჭირე ნებისმიერ კლავიშს.</p>`,
    },
    lines: [
      ['10 LET n=1', 'Puts 1 in n. This line runs only once.', 'n-ში დებს 1-ს. ეს ხაზი მხოლოდ ერთხელ სრულდება.'],
      ['20 PRINT n', 'Prints the current value of n.', 'ბეჭდავს n-ის მიმდინარე მნიშვნელობას.'],
      ['30 LET n=n*2', 'Doubles n and stores the result back in n.', 'n-ს აორმაგებს და შედეგს ისევ n-ში ინახავს.'],
      ['40 GO TO 20', 'Jumps back to line 20, so lines 20 to 40 repeat for ever. Press Break to stop.', 'ბრუნდება ხაზზე 20, ამიტომ ხაზები 20-დან 40-მდე უსასრულოდ მეორდება. გასაჩერებლად დააჭირე „შეჩერებას“.'],
    ],
  },
  {
    title: { en: '9. Colour and drawing', ka: '9. ფერები და ხატვა' },
    text: {
      en: `<p>Colours are numbered 0 to 7: 0 black, 1 blue, 2 red, 3 magenta, 4 green, 5 cyan, 6 yellow, 7 white.</p>
<p><code>BORDER</code> colours the edge of the screen, <code>PAPER</code> is the background and <code>INK</code> is the pen. <code>CLS</code> clears the screen.</p>
<p>The drawing area is 256 dots wide and 176 high. Dot 0,0 is the bottom-left corner.</p>`,
      ka: `<p>ფერები დანომრილია 0-დან 7-მდე: 0 შავი, 1 ლურჯი, 2 წითელი, 3 იისფერი, 4 მწვანე, 5 ცისფერი, 6 ყვითელი, 7 თეთრი.</p>
<p><code>BORDER</code> ეკრანის ჩარჩოს აფერადებს, <code>PAPER</code> ფონია, <code>INK</code> კი კალმის ფერი. <code>CLS</code> ეკრანს ასუფთავებს.</p>
<p>სახატავი არე 256 წერტილის სიგანისა და 176 წერტილის სიმაღლისაა. წერტილი 0,0 ქვედა მარცხენა კუთხეა.</p>`,
    },
    lines: [
      ['10 BORDER 1: PAPER 0: INK 6: CLS', 'Four instructions joined by colons: blue border, black background, yellow pen, then CLS clears the screen to the background colour.', 'ოთხი ბრძანება ორწერტილებით არის გაერთიანებული: ლურჯი ჩარჩო, შავი ფონი, ყვითელი კალამი, შემდეგ CLS ეკრანს ფონის ფერით ასუფთავებს.'],
      ['20 PLOT 50,30', 'Draws one dot 50 across and 30 up from the bottom-left corner. Drawing continues from this dot.', 'სვამს ერთ წერტილს: ქვედა მარცხენა კუთხიდან 50 მარჯვნივ და 30 ზევით. ხატვა ამ წერტილიდან გრძელდება.'],
      ['30 DRAW 150,0: DRAW 0,100', 'Draws a line 150 dots to the right, then a line 100 dots up.', 'ხაზავს ხაზს 150 წერტილით მარჯვნივ, შემდეგ კი 100 წერტილით ზევით.'],
      ['40 DRAW -150,0: DRAW 0,-100', 'Negative numbers go left and down: 150 left, then 100 down. This closes the box.', 'უარყოფითი რიცხვები მარცხნივ და ქვევით მიდის: 150 მარცხნივ, შემდეგ 100 ქვევით. ასე ოთხკუთხედი იკვრება.'],
      ['50 INK 5: CIRCLE 125,80,40', 'Changes the pen to cyan and draws a circle with its centre at 125,80 and a radius of 40.', 'კალმის ფერს ცისფრად ცვლის და ხაზავს წრეს, რომლის ცენტრია 125,80, რადიუსი კი 40.'],
      ['60 INK 7: PRINT AT 0,9;"A box and a circle"', 'White pen. AT 0,9 moves to row 0, column 9 before printing the text.', 'თეთრი კალამი. AT 0,9 ტექსტის დაბეჭდვამდე გადადის სტრიქონზე 0, სვეტზე 9.'],
    ],
  },
  {
    title: { en: '10. BEEP: sound', ka: '10. BEEP: ხმა' },
    text: {
      en: `<p><code>BEEP time,note</code> plays a note. <em>time</em> is in seconds. Note 0 is middle C, and each step of 1 is one piano key up; negative numbers go lower.</p>
<p>A colon <code>:</code> lets you put several instructions on one line.</p>`,
      ka: `<p><code>BEEP დრო,ნოტა</code> ნოტს უკრავს. <em>დრო</em> წამებშია. ნოტა 0 პირველი ოქტავის „დო“-ა, ყოველი 1 ერთი კლავიშით მაღლაა; უარყოფითი რიცხვები უფრო დაბალია.</p>
<p>ორწერტილი <code>:</code> საშუალებას გაძლევს ერთ ხაზზე რამდენიმე ბრძანება დაწერო.</p>`,
    },
    lines: [
      ['10 BEEP 0.3,0: BEEP 0.3,4: BEEP 0.3,7', 'Plays three notes, each 0.3 seconds long: C, E and G.', 'უკრავს სამ ნოტს, თითოს 0.3 წამის განმავლობაში: დო, მი და სოლ.'],
      ['20 BEEP 0.6,12', 'Plays the C one octave higher for 0.6 seconds.', 'უკრავს ერთი ოქტავით მაღალ „დო“-ს 0.6 წამის განმავლობაში.'],
      ['30 FOR n=12 TO 0 STEP -1', 'Starts a loop in which n counts down from 12 to 0.', 'იწყებს ციკლს, რომელშიც n 12-დან 0-მდე უკან ითვლის.'],
      ['40 BEEP 0.05,n', 'Plays a very short note at pitch n, so the notes fall one by one.', 'უკრავს ძალიან მოკლე ნოტს n სიმაღლეზე, ამიტომ ნოტები რიგრიგობით დაბლდება.'],
      ['50 NEXT n', 'Goes back for the next lower note until n has passed 0.', 'ბრუნდება შემდეგი, უფრო დაბალი ნოტისთვის, სანამ n 0-ს არ გადასცდება.'],
    ],
  },
  {
    title: { en: '11. Reports and mistakes', ka: '11. შეტყობინებები და შეცდომები' },
    text: {
      en: `<p>When a program stops, the Spectrum shows a <strong>report</strong> at the bottom of the screen: a code, a message, then the line where it stopped.</p>
<ul><li><code>0 OK</code> finished normally.</li>
<li><code>C Nonsense in BASIC</code> a typing mistake, such as a missing quote or a misspelt keyword.</li>
<li><code>2 Variable not found</code> a variable was used before it was given a value.</li>
<li><code>B Integer out of range</code> a number is too big or too small, such as a colour above 7.</li>
<li><code>L BREAK into program</code> you pressed Break.</li></ul>
<p>This program has a mistake on purpose. Run it, read the report, then fix line 20 in the Program tab.</p>`,
      ka: `<p>როცა პროგრამა ჩერდება, Spectrum ეკრანის ქვემოთ აჩვენებს <strong>შეტყობინებას</strong>: კოდს, ტექსტს და ხაზს, სადაც გაჩერდა.</p>
<ul><li><code>0 OK</code> ნორმალურად დასრულდა.</li>
<li><code>C Nonsense in BASIC</code> აკრეფის შეცდომა, მაგალითად გამოტოვებული ბრჭყალი ან არასწორად დაწერილი ბრძანება.</li>
<li><code>2 Variable not found</code> ცვლადი გამოყენებულია მანამ, სანამ მნიშვნელობას მიიღებდა.</li>
<li><code>B Integer out of range</code> რიცხვი ზედმეტად დიდი ან პატარაა, მაგალითად ფერი 7-ზე მეტია.</li>
<li><code>L BREAK into program</code> შენ დააჭირე „შეჩერებას“.</li></ul>
<p>ამ პროგრამაში შეცდომა განზრახ არის დაშვებული. გაუშვი, წაიკითხე შეტყობინება, შემდეგ კი „პროგრამის“ ჩანართში გაასწორე ხაზი 20.</p>`,
    },
    lines: [
      ['10 PRINT "Counting sheep"', 'Prints the text. This line works.', 'ბეჭდავს ტექსტს. ეს ხაზი სწორად მუშაობს.'],
      ['20 PRINT sheep', 'There are no quotes, so the Spectrum looks for a variable called sheep. It was never given a value, so the program stops here with the report 2 Variable not found. To fix it, put quotes around sheep, or add a line 15 LET sheep=3.', 'ბრჭყალები არ არის, ამიტომ Spectrum ეძებს ცვლადს სახელად sheep. მას მნიშვნელობა არასდროს მიუღია, ამიტომ პროგრამა აქ ჩერდება შეტყობინებით 2 Variable not found. გასასწორებლად sheep ბრჭყალებში ჩასვი, ან დაამატე ხაზი 15 LET sheep=3.'],
      ['30 PRINT "Good night"', 'This line is not reached until line 20 is fixed.', 'ამ ხაზამდე პროგრამა ვერ მიდის, სანამ ხაზი 20 არ გასწორდება.'],
    ],
  },
];
