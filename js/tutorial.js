// Lessons for the "Learn BASIC" tab, in English (en) and Georgian (ka).
// `text` is trusted HTML written here. `lines` is the program: [code, English explanation, Georgian explanation].
export const LESSONS = [
  {
    title: { en: '1. Lines and line numbers', ka: '1. ხაზები და მათი ნომრები' },
    text: {
      en: `<p>A BASIC program is a list of instructions. Every instruction sits on its own line, and every line starts with a <strong>line number</strong>.</p>
<p>The Spectrum runs the lines in number order, lowest first. The number is only an order and a name for the line; it is not printed.</p>
<p>Programmers count in tens (10, 20, 30) so there is room to add a line in between later, for example line 15.</p>
<p>When the program ends, the Spectrum shows a report at the bottom: <code>0 OK, 20:1</code> means "finished with no error; the last line was 20".</p>`,
      ka: `<p>BASIC-ზე დაწერილი პროგრამა ბრძანებების სიაა. თითო ბრძანება ცალკე ხაზზე იწერება, და ყველა ხაზი <strong>ნომრით</strong> იწყება.</p>
<p>Spectrum ხაზებს ნომრების მიხედვით ასრულებს: ჯერ ყველაზე პატარა ნომერს, მერე მომდევნოს. ნომერი მხოლოდ ხაზების რიგს განსაზღვრავს და ეკრანზე არ იბეჭდება.</p>
<p>ხაზებს ჩვეულებრივ ათობით ნომრავენ (10, 20, 30). ასე მათ შორის ადგილი რჩება, და მერე ახალი ხაზის ჩამატება ადვილია, მაგალითად ხაზის 15.</p>
<p>როცა პროგრამა დამთავრდება, Spectrum ეკრანის ქვედა ნაწილში წერს შეტყობინებას. <code>0 OK, 20:1</code> ნიშნავს: „ყველაფერი რიგზეა, პროგრამა დამთავრდა ხაზზე 20“.</p>`,
    },
    lines: [
      ['10 PRINT "Line ten runs first"', '10 is the line number. PRINT shows the text inside the quotes on the screen. This line runs first because 10 is the lowest number.', '10 არის ხაზის ნომერი. PRINT ეკრანზე ბეჭდავს ბრჭყალებში ჩაწერილ ტექსტს. ეს ხაზი პირველი სრულდება, რადგან 10 ყველაზე პატარა ნომერია.'],
      ['20 PRINT "Line twenty runs second"', '20 is bigger than 10, so this line runs next. It prints its text on a new row.', '20 მეტია 10-ზე, ამიტომ ეს ხაზი მეორე სრულდება. მისი ტექსტი ახალ სტრიქონზე იბეჭდება.'],
    ],
  },
  {
    title: { en: '2. REM: notes for humans', ka: '2. REM: შენიშვნები ადამიანებისთვის' },
    text: {
      en: `<p><code>REM</code> is short for <strong>remark</strong>. The Spectrum ignores everything after REM on that line. It is a note for the person reading the program.</p>
<p>Use REM to give the program a title or to explain a tricky part.</p>`,
      ka: `<p><code>REM</code> ინგლისური სიტყვის <strong>remark</strong> („შენიშვნა“) შემოკლებაა. რაც ხაზზე REM-ის შემდეგ წერია, Spectrum-ისთვის არ არის: ის ამას უბრალოდ გამოტოვებს. შენიშვნა იმ ადამიანისთვის იწერება, ვინც პროგრამას წაიკითხავს.</p>
<p>REM-ით შეგიძლია პროგრამას სათაური დაუწერო ან რთული ადგილი ახსნა.</p>`,
    },
    lines: [
      ['10 REM This program says hello', 'REM means remark. The Spectrum skips this line; it is a note telling people what the program is for.', 'REM ნიშნავს შენიშვნას. Spectrum ამ ხაზს გამოტოვებს; აქ ადამიანისთვის წერია, რას აკეთებს პროგრამა.'],
      ['20 PRINT "Hello!"', 'Prints Hello! on the screen.', 'ეკრანზე ბეჭდავს: Hello!'],
      ['30 REM The next line prints a sum', 'Another remark. Nothing happens on the screen.', 'კიდევ ერთი შენიშვნა. ეკრანზე არაფერი იცვლება.'],
      ['40 PRINT 2+3', 'There are no quotes, so the Spectrum works out 2+3 and prints the answer, 5.', 'ბრჭყალები არ წერია, ამიტომ Spectrum ჯერ გამოითვლის, რას უდრის 2+3, და ეკრანზე პასუხს ბეჭდავს: 5.'],
    ],
  },
  {
    title: { en: '3. PRINT: showing things', ka: '3. PRINT: ეკრანზე ბეჭდვა' },
    text: {
      en: `<p><code>PRINT</code> puts something on the screen.</p>
<ul><li>Text goes inside quotes and is printed exactly as written.</li>
<li>Without quotes the Spectrum works out the answer first.</li>
<li>A semicolon <code>;</code> joins things on the same row with no gap. A comma <code>,</code> jumps to the middle of the screen.</li></ul>
<p>Sums use <code>+</code> <code>-</code> <code>*</code> (times) and <code>/</code> (divide).</p>`,
      ka: `<p><code>PRINT</code> ეკრანზე ბეჭდავს იმას, რაც მის შემდეგ წერია.</p>
<ul><li>ტექსტი ბრჭყალებში იწერება და ზუსტად ისე იბეჭდება, როგორც წერია.</li>
<li>თუ ბრჭყალები არ არის, Spectrum ჯერ პასუხს გამოითვლის და მერე პასუხს ბეჭდავს.</li>
<li>წერტილ-მძიმე <code>;</code> ნიშნავს „გვერდით მიაწერე“: შემდეგი რამ იმავე სტრიქონზე, შუალედის გარეშე იბეჭდება. მძიმე <code>,</code> ეკრანის შუაში გადადის.</li></ul>
<p>გამოთვლებში გამოიყენება <code>+</code> (მიმატება), <code>-</code> (გამოკლება), <code>*</code> (გამრავლება) და <code>/</code> (გაყოფა).</p>`,
    },
    lines: [
      ['10 PRINT "Hello"', 'Prints the word Hello exactly as written.', 'ბეჭდავს სიტყვას Hello, ზუსტად ისე, როგორც წერია.'],
      ['20 PRINT 6*7', 'The star means times. The Spectrum works out 6 times 7 and prints 42.', 'ვარსკვლავი გამრავლებას ნიშნავს. Spectrum 6-ს ამრავლებს 7-ზე და ბეჭდავს პასუხს: 42.'],
      ['30 PRINT "6 times 7 is ";6*7', 'Prints the text, then the semicolon puts the answer 42 right after it on the same row.', 'ჯერ ტექსტს ბეჭდავს. წერტილ-მძიმის გამო პასუხი 42 იმავე სტრიქონზე, ტექსტის გვერდით იბეჭდება.'],
      ['40 PRINT', 'PRINT with nothing after it leaves an empty row.', 'PRINT-ის შემდეგ არაფერი წერია, ამიტომ ეკრანზე ერთი ცარიელი სტრიქონი რჩება.'],
      ['50 PRINT "left","right"', 'Prints left, then the comma moves to the middle of the screen before printing right.', 'ბეჭდავს სიტყვას left, მძიმის გამო ეკრანის შუაში გადადის და იქ ბეჭდავს სიტყვას right.'],
    ],
  },
  {
    title: { en: '4. LET: remembering values', ka: '4. LET: მნიშვნელობის დამახსოვრება' },
    text: {
      en: `<p>A <strong>variable</strong> is a named box that holds a value. <code>LET</code> puts a value in the box.</p>
<p>A box for a number can have any name. A box for text has a one-letter name ending in <code>$</code>.</p>
<p>If you use a variable before giving it a value, the Spectrum stops with the report <code>2 Variable not found</code>.</p>`,
      ka: `<p><strong>ცვლადი</strong> არის ყუთი, რომელსაც სახელი აქვს და რომელშიც მნიშვნელობა ინახება. <code>LET</code> ამ ყუთში მნიშვნელობას წერს.</p>
<p>რიცხვის ცვლადს ნებისმიერი სახელი შეიძლება დაარქვა. ტექსტის ცვლადის სახელი კი ერთი ასოა და ბოლოში <code>$</code> აწერია.</p>
<p>თუ ცვლადს გამოიყენებ მანამ, სანამ მასში რამეს ჩაწერ, Spectrum გაჩერდება და დაწერს: <code>2 Variable not found</code> („ცვლადი ვერ მოიძებნა“).</p>`,
    },
    lines: [
      ['10 LET n$="Anna"', 'Makes a text box called n$ and puts the name Anna in it. The $ sign means the box holds text.', 'ქმნის ტექსტის ცვლადს n$ და მასში წერს სახელს Anna. ნიშანი $ ნიშნავს, რომ ცვლადში ტექსტი ინახება.'],
      ['20 LET age=12', 'Makes a number box called age and puts 12 in it.', 'ქმნის რიცხვის ცვლადს age და მასში წერს რიცხვს 12.'],
      ['30 PRINT n$;" is ";age', 'Prints what is in n$, then the word is, then what is in age. The screen shows: Anna is 12', 'ბეჭდავს იმას, რაც n$-ში ინახება, მერე სიტყვას is, მერე იმას, რაც age-ში ინახება. ეკრანზე გამოჩნდება: Anna is 12'],
      ['40 LET age=age+1', 'Takes the number in age (12), adds 1 and stores the result (13) back in age.', 'იღებს რიცხვს, რომელიც age-ში ინახება (12), უმატებს 1-ს და პასუხს (13) ისევ age-ში წერს.'],
      ['50 PRINT "Next year: ";age', 'Prints the text and the new value of age, which is 13.', 'ბეჭდავს ტექსტს და age-ის ახალ მნიშვნელობას: 13.'],
    ],
  },
  {
    title: { en: '5. INPUT: asking a question', ka: '5. INPUT: კითხვის დასმა' },
    text: {
      en: `<p><code>INPUT</code> stops the program and waits for the person to type something, then stores it in a variable.</p>
<p>After the program starts, click the Spectrum screen, type your answer and press Enter. The question appears at the bottom of the screen.</p>`,
      ka: `<p><code>INPUT</code> პროგრამას აჩერებს და ელოდება, სანამ მომხმარებელი პასუხს აკრეფს. მერე ამ პასუხს ცვლადში წერს.</p>
<p>როცა პროგრამას გაუშვებ, დააწკაპუნე Spectrum-ის ეკრანზე, აკრიფე პასუხი და დააჭირე Enter-ს. კითხვა ეკრანის ქვედა ნაწილში ჩანს.</p>`,
    },
    lines: [
      ['10 INPUT "What is your name? ";n$', 'Shows the question at the bottom of the screen and waits. What you type goes into the text box n$ when you press Enter.', 'ეკრანის ქვედა ნაწილში წერს კითხვას და ელოდება. რასაც აკრეფ, Enter-ის დაჭერის შემდეგ ტექსტის ცვლადში n$ ჩაიწერება.'],
      ['20 INPUT "How old are you? ";age', 'Asks a second question and stores the number you type in age.', 'მეორე კითხვას სვამს. რიცხვი, რომელსაც აკრეფ, ცვლადში age ჩაიწერება.'],
      ['30 PRINT "Hello, ";n$', 'Prints Hello, followed by the name you typed.', 'ბეჭდავს Hello, და მის გვერდით სახელს, რომელიც აკრიფე.'],
      ['40 PRINT "In ten years you will be ";age+10', 'Adds 10 to your age and prints the result after the text.', 'შენს ასაკს 10-ს უმატებს და პასუხს ტექსტის გვერდით ბეჭდავს.'],
    ],
  },
  {
    title: { en: '6. IF ... THEN: making decisions', ka: '6. IF ... THEN: პირობის შემოწმება' },
    text: {
      en: `<p><code>IF</code> tests something. When the test is true, the Spectrum does what comes after <code>THEN</code>. When it is false, it skips to the next line.</p>
<p>The tests are <code>=</code> equal, <code>&lt;</code> less than, <code>&gt;</code> greater than, <code>&lt;&gt;</code> not equal, <code>&lt;=</code> less or equal, <code>&gt;=</code> greater or equal.</p>`,
      ka: `<p><code>IF</code> („თუ“) პირობას ამოწმებს. თუ პირობა სრულდება, Spectrum აკეთებს იმას, რაც <code>THEN</code>-ის („მაშინ“) შემდეგ წერია. თუ არ სრულდება, პირდაპირ შემდეგ ხაზზე გადადის.</p>
<p>შედარების ნიშნებია: <code>=</code> უდრის, <code>&lt;</code> ნაკლებია, <code>&gt;</code> მეტია, <code>&lt;&gt;</code> არ უდრის, <code>&lt;=</code> ნაკლებია ან ტოლია, <code>&gt;=</code> მეტია ან ტოლია.</p>`,
    },
    lines: [
      ['10 INPUT "Type a number: ";n', 'Waits for you to type a number and stores it in n.', 'ელოდება, სანამ რიცხვს აკრეფ, და ამ რიცხვს ცვლადში n წერს.'],
      ['20 IF n>100 THEN PRINT "That is big"', 'Tests whether n is greater than 100. If yes, it prints the message. If no, it skips the rest of this line.', 'ამოწმებს, არის თუ არა n 100-ზე მეტი. თუ მეტია, ბეჭდავს ტექსტს. თუ არა, ამ ხაზზე მეტს არაფერს აკეთებს.'],
      ['30 IF n<=100 THEN PRINT "That is small"', 'Tests whether n is 100 or less. Exactly one of lines 20 and 30 prints.', 'ამოწმებს, არის თუ არა n 100 ან 100-ზე ნაკლები. ხაზებიდან 20 და 30 ყოველთვის მხოლოდ ერთი ბეჭდავს ტექსტს.'],
      ['40 IF n=7 THEN PRINT "Lucky seven!"', 'Prints an extra message only when n is exactly 7.', 'ამ ტექსტს მხოლოდ მაშინ ბეჭდავს, როცა n ზუსტად 7-ის ტოლია.'],
    ],
  },
  {
    title: { en: '7. FOR ... NEXT: repeating', ka: '7. FOR ... NEXT: გამეორება' },
    text: {
      en: `<p><code>FOR</code> and <code>NEXT</code> repeat the lines between them. <code>FOR n=1 TO 5</code> runs them five times, with <em>n</em> counting 1, 2, 3, 4, 5.</p>
<p>Add <code>STEP</code> to count differently: <code>FOR n=10 TO 0 STEP -2</code> counts down in twos.</p>`,
      ka: `<p><code>FOR</code> და <code>NEXT</code> რამდენჯერმე იმეორებს ხაზებს, რომლებიც მათ შორის წერია. <code>FOR n=1 TO 5</code> ამ ხაზებს ხუთჯერ ასრულებს, <em>n</em> კი ამ დროს რიგრიგობით ხდება 1, 2, 3, 4, 5.</p>
<p>თუ გინდა, რომ თვლა სხვანაირად მიდიოდეს, დაამატე <code>STEP</code>: <code>FOR n=10 TO 0 STEP -2</code> 10-დან უკუღმა ითვლის, ორ-ორით.</p>`,
    },
    lines: [
      ['10 FOR n=1 TO 5', 'Starts a loop. n begins at 1. The lines down to NEXT repeat until n has passed 5.', 'იწყებს ციკლს. თავიდან n უდრის 1-ს. ხაზები აქედან NEXT-ამდე მეორდება, სანამ n 5-ს არ გასცდება.'],
      ['20 PRINT "This is turn ";n', 'Runs once on every turn of the loop and prints the current value of n.', 'ციკლის ყოველ გამეორებაზე სრულდება და ბეჭდავს, რას უდრის n ამ დროს.'],
      ['30 NEXT n', 'Adds 1 to n. If n is still 5 or less, it jumps back to the line after FOR. Otherwise the program carries on below.', 'n-ს 1-ს უმატებს. თუ n ჯერ კიდევ არ გასცდა 5-ს, პროგრამა FOR-ის მომდევნო ხაზს უბრუნდება. თუ გასცდა, პროგრამა ქვემოთ აგრძელებს.'],
      ['40 PRINT "Finished"', 'Runs once, after the loop has ended.', 'ერთხელ სრულდება, როცა ციკლი დამთავრდება.'],
    ],
  },
  {
    title: { en: '8. GO TO: jumping', ka: '8. GO TO: სხვა ხაზზე გადასვლა' },
    text: {
      en: `<p><code>GO TO</code> jumps to another line by its number. This is why line numbers matter.</p>
<p>This program jumps back for ever. To stop it, press the <strong>Break</strong> button (or Esc). If the screen fills up and asks <code>scroll?</code>, press any key to carry on.</p>`,
      ka: `<p><code>GO TO</code> („გადადი“) პროგრამას სხვა ხაზზე გადაიყვანს; რომელზე, ამას ხაზის ნომერი ეუბნება. აი, რატომ არის ხაზის ნომრები საჭირო.</p>
<p>ეს პროგრამა სულ უკან ბრუნდება და თავისით არასდროს ჩერდება. გასაჩერებლად დააჭირე ღილაკს <strong>შეჩერება</strong> (ან კლავიშს Esc). თუ ეკრანი გაივსო და Spectrum გეკითხება <code>scroll?</code>, გასაგრძელებლად ნებისმიერ კლავიშს დააჭირე.</p>`,
    },
    lines: [
      ['10 LET n=1', 'Puts 1 in n. This line runs only once.', 'ცვლადში n წერს 1-ს. ეს ხაზი მხოლოდ ერთხელ სრულდება.'],
      ['20 PRINT n', 'Prints the current value of n.', 'ბეჭდავს, რას უდრის n ამ დროს.'],
      ['30 LET n=n*2', 'Doubles n and stores the result back in n.', 'n-ს ორზე ამრავლებს და პასუხს ისევ n-ში წერს.'],
      ['40 GO TO 20', 'Jumps back to line 20, so lines 20 to 40 repeat for ever. Press Break to stop.', 'პროგრამა ხაზს 20 უბრუნდება, ამიტომ ხაზები 20-დან 40-მდე დაუსრულებლად მეორდება. გასაჩერებლად დააჭირე ღილაკს „შეჩერება“.'],
    ],
  },
  {
    title: { en: '9. Colour and drawing', ka: '9. ფერები და ხატვა' },
    text: {
      en: `<p>Colours are numbered 0 to 7: 0 black, 1 blue, 2 red, 3 magenta, 4 green, 5 cyan, 6 yellow, 7 white.</p>
<p><code>BORDER</code> colours the edge of the screen, <code>PAPER</code> is the background and <code>INK</code> is the pen. <code>CLS</code> clears the screen.</p>
<p>The drawing area is 256 dots wide and 176 high. Dot 0,0 is the bottom-left corner.</p>`,
      ka: `<p>ფერებს ნომრები აქვს, 0-დან 7-მდე: 0 შავი, 1 ლურჯი, 2 წითელი, 3 იისფერი, 4 მწვანე, 5 ცისფერი, 6 ყვითელი, 7 თეთრი.</p>
<p><code>BORDER</code> ცვლის ეკრანის ჩარჩოს ფერს, <code>PAPER</code> ფონის ფერს, <code>INK</code> კი ასოებისა და ნახაზის ფერს. <code>CLS</code> ეკრანს ასუფთავებს.</p>
<p>სახატავი ეკრანი 256 წერტილის სიგანისაა და 176 წერტილის სიმაღლის. წერტილი 0,0 ქვედა მარცხენა კუთხეშია.</p>`,
    },
    lines: [
      ['10 BORDER 1: PAPER 0: INK 6: CLS', 'Four instructions joined by colons: blue border, black background, yellow pen, then CLS clears the screen to the background colour.', 'ერთ ხაზზე ოთხი ბრძანება წერია, ორწერტილებით გამოყოფილი: ჩარჩო ლურჯი, ფონი შავი, ასოები და ნახაზი ყვითელი. ბოლოს CLS ეკრანს ასუფთავებს და ფონის ფერით ავსებს.'],
      ['20 PLOT 50,30', 'Draws one dot 50 across and 30 up from the bottom-left corner. Drawing continues from this dot.', 'სვამს ერთ წერტილს: ქვედა მარცხენა კუთხიდან 50 წერტილით მარჯვნივ და 30 წერტილით ზევით. ხატვა ამ წერტილიდან გაგრძელდება.'],
      ['30 DRAW 150,0: DRAW 0,100', 'Draws a line 150 dots to the right, then a line 100 dots up.', 'ავლებს ხაზს 150 წერტილით მარჯვნივ, მერე მეორე ხაზს 100 წერტილით ზევით.'],
      ['40 DRAW -150,0: DRAW 0,-100', 'Negative numbers go left and down: 150 left, then 100 down. This closes the box.', 'უარყოფითი რიცხვები ნიშნავს მარცხნივ და ქვევით: ჯერ 150 წერტილით მარცხნივ, მერე 100 წერტილით ქვევით. ასე მართკუთხედი იკვრება.'],
      ['50 INK 5: CIRCLE 125,80,40', 'Changes the pen to cyan and draws a circle with its centre at 125,80 and a radius of 40.', 'ფერს ცისფრად ცვლის და ხატავს წრეს: ცენტრი წერტილშია 125,80, რადიუსი კი 40 წერტილია.'],
      ['60 INK 7: PRINT AT 0,9;"A box and a circle"', 'White pen. AT 0,9 moves to row 0, column 9 before printing the text.', 'ფერს თეთრად ცვლის. AT 0,9 ნიშნავს, რომ ტექსტი დაიბეჭდება სტრიქონში 0, მე-9 სვეტიდან.'],
    ],
  },
  {
    title: { en: '10. BEEP: sound', ka: '10. BEEP: ხმა' },
    text: {
      en: `<p><code>BEEP time,note</code> plays a note. <em>time</em> is in seconds. Note 0 is middle C, and each step of 1 is one piano key up; negative numbers go lower.</p>
<p>A colon <code>:</code> lets you put several instructions on one line.</p>`,
      ka: `<p><code>BEEP დრო,ნოტი</code> ერთ ნოტს უკრავს. <em>დრო</em> წამებში იწერება. ნოტი 0 პირველი ოქტავის „დო“-ა; ყოველი 1 ფორტეპიანოს ერთი კლავიშით მაღალია, უარყოფითი რიცხვები კი უფრო დაბალი ნოტებია.</p>
<p>ორწერტილით <code>:</code> ერთ ხაზზე რამდენიმე ბრძანების დაწერა შეიძლება.</p>`,
    },
    lines: [
      ['10 BEEP 0.3,0: BEEP 0.3,4: BEEP 0.3,7', 'Plays three notes, each 0.3 seconds long: C, E and G.', 'უკრავს სამ ნოტს: დო, მი, სოლ. თითო ნოტი 0.3 წამს გრძელდება.'],
      ['20 BEEP 0.6,12', 'Plays the C one octave higher for 0.6 seconds.', 'უკრავს ერთი ოქტავით მაღალ „დო“-ს, 0.6 წამის განმავლობაში.'],
      ['30 FOR n=12 TO 0 STEP -1', 'Starts a loop in which n counts down from 12 to 0.', 'იწყებს ციკლს: n 12-დან 0-მდე უკუღმა ითვლის.'],
      ['40 BEEP 0.05,n', 'Plays a very short note at pitch n, so the notes fall one by one.', 'უკრავს ძალიან მოკლე ნოტს, რომლის სიმაღლეა n. ამიტომ ყოველი შემდეგი ნოტი წინაზე დაბალია.'],
      ['50 NEXT n', 'Goes back for the next lower note until n has passed 0.', 'პროგრამა უკან ბრუნდება შემდეგი, უფრო დაბალი ნოტის დასაკრავად, სანამ n 0-ს არ გასცდება.'],
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
      ka: `<p>როცა პროგრამა ჩერდება, Spectrum ეკრანის ქვედა ნაწილში წერს <strong>შეტყობინებას</strong>: ჯერ კოდს, მერე ტექსტს, ბოლოს კი ხაზის ნომერს, რომელზეც გაჩერდა.</p>
<ul><li><code>0 OK</code> პროგრამა ჩვეულებრივად დამთავრდა.</li>
<li><code>C Nonsense in BASIC</code> რაღაც არასწორად არის აკრეფილი, მაგალითად აკლია ბრჭყალი ან ბრძანება შეცდომით წერია.</li>
<li><code>2 Variable not found</code> გამოყენებულია ცვლადი, რომელშიც ჯერ არაფერი ჩაწერილა.</li>
<li><code>B Integer out of range</code> რიცხვი ზედმეტად დიდია ან ზედმეტად პატარა, მაგალითად ფერის ნომერი 7-ზე მეტია.</li>
<li><code>L BREAK into program</code> პროგრამა შენ გააჩერე ღილაკით „შეჩერება“.</li></ul>
<p>ამ პროგრამაში შეცდომა განგებ არის დაშვებული. გაუშვი, წაიკითხე შეტყობინება, მერე კი ჩანართში „პროგრამა“ გაასწორე ხაზი 20.</p>`,
    },
    lines: [
      ['10 PRINT "Counting sheep"', 'Prints the text. This line works.', 'ბეჭდავს ტექსტს. ამ ხაზში შეცდომა არ არის.'],
      ['20 PRINT sheep', 'There are no quotes, so the Spectrum looks for a variable called sheep. It was never given a value, so the program stops here with the report 2 Variable not found. To fix it, put quotes around sheep, or add a line 15 LET sheep=3.', 'ბრჭყალები არ წერია, ამიტომ Spectrum ეძებს ცვლადს, რომელსაც sheep ჰქვია. ასეთ ცვლადში არაფერი ჩაწერილა, ამიტომ პროგრამა აქ ჩერდება და წერს: 2 Variable not found. გასასწორებლად ან სიტყვა sheep ჩასვი ბრჭყალებში, ან დაამატე ხაზი: 15 LET sheep=3.'],
      ['30 PRINT "Good night"', 'This line is not reached until line 20 is fixed.', 'ამ ხაზამდე პროგრამა ვერ მივა, სანამ ხაზს 20 არ გაასწორებ.'],
    ],
  },
];
