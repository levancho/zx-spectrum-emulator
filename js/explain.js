// Explains any line of Sinclair BASIC in plain words, in English (en) or Georgian (ka).
// explainLine(text, lang) returns { num, parts: [html] }: one part per instruction on the line.

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
    letPut: '{1}-ს დებს ცვლადში {0}.',
    noNumber: 'ამ სტრიქონს ხაზის ნომერი არ აქვს. პროგრამის ყველა ხაზი ნომრით უნდა იწყებოდეს.',
    empty: 'ამ ხაზს ნომერი აქვს, მაგრამ ბრძანება ჯერ არ წერია.',
    unknown: 'Spectrum ვერ გაიგებს ამას: {0}. ბრძანება BASIC-ის სიტყვით უნდა იწყებოდეს, მაგალითად PRINT ან LET.',
    noLet: 'როგორც ჩანს, აქ მნიშვნელობის შენახვა გინდა, მაგრამ ბრძანების სიტყვა აკლია. დაწერე ასე: {0}.',
    REM: 'შენიშვნა. Spectrum ამ ხაზს გამოტოვებს; ეს ჩანაწერია ადამიანებისთვის, ვინც პროგრამას კითხულობს.',
    printEmpty: 'ეკრანზე ერთ ცარიელ სტრიქონს ტოვებს.',
    print: 'ეკრანზე გამოაქვს: {0}.',
    then: ', შემდეგ ',
    pText: 'ტექსტი {0}',
    pValue: '{0}-ის მნიშვნელობა',
    pAt: 'გადადის სტრიქონზე {0}, სვეტზე {1}',
    pTab: 'გადადის სვეტზე {0}',
    pColour: 'ამ PRINT-ისთვის იყენებს {0}',
    printStay: 'ბოლოში დასმული წერტილ-მძიმის გამო შემდეგი PRINT იმავე სტრიქონზე გააგრძელებს.',
    printComma: 'მძიმე ეკრანის შემდეგ ნახევარში გადადის.',
    let: 'ითვლის {1}-ს და შედეგს ინახავს ცვლადში {0}.',
    letText: 'ტექსტს {1} ინახავს ტექსტურ ცვლადში {0}.',
    input: 'ელოდება, სანამ რამეს აკრეფ და Enter-ს დააჭერ, შემდეგ კი აკრეფილს ინახავს აქ: {0}.',
    inputAsk: 'ჯერ აჩვენებს კითხვას {0}.',
    if: 'ამოწმებს, სწორია თუ არა პირობა {0}. თუ სწორია, Spectrum ასრულებს ხაზის დანარჩენ ნაწილს:',
    ifElse: 'თუ არ არის სწორი, გადადის შემდეგ ხაზზე.',
    for: 'იწყებს ციკლს. {0} ითვლის {1}-დან {2}-მდე. ხაზები NEXT {0}-მდე ყოველ ბიჯზე მეორდება.',
    forStep: 'იწყებს ციკლს. {0} ითვლის {1}-დან {2}-მდე, ბიჯით {3}. ხაზები NEXT {0}-მდე ყოველ ბიჯზე მეორდება.',
    NEXT: 'ციკლის ბოლო. {0} გადადის შემდეგ მნიშვნელობაზე და პროგრამა ბრუნდება FOR-ის შემდეგ ხაზზე, სანამ ციკლი არ დამთავრდება.',
    goto: 'გადადის ხაზზე {0} და იქიდან აგრძელებს.',
    gosub: 'გადადის ქვეპროგრამაზე ხაზზე {0}. RETURN პროგრამას აქ დააბრუნებს.',
    RETURN: 'ბრუნდება იმ GO SUB-ის შემდეგ, რომელმაც აქ გადმოიყვანა.',
    CLS: 'ასუფთავებს ეკრანს და ავსებს მას ფონის ფერით.',
    BORDER: 'ეკრანის ჩარჩოს ფერს აყენებს: {0}.',
    PAPER: 'აყენებს ფონის ფერს იმისთვის, რაც შემდეგ დაიბეჭდება: {0}.',
    INK: 'აყენებს კალმის ფერს იმისთვის, რაც შემდეგ დაიბეჭდება ან დაიხატება: {0}.',
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

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const codeTag = s => `<code>${esc(String(s).trim())}</code>`;

// Splits at any of the separator characters that are outside quotes and brackets.
function splitTop(s, seps) {
  const out = [];
  let cur = '', depth = 0, inQ = false;
  for (const ch of s) {
    if (ch === '"') inQ = !inQ;
    if (!inQ) { if (ch === '(') depth++; else if (ch === ')') depth--; }
    if (!inQ && depth <= 0 && seps.includes(ch)) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
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
const outsideQuotes = s => s.replace(/"[^"]*"?/g, '""');

function explainStatement(stmt, L) {
  const s = stmt.trim();
  const tr = (key, ...args) => L[key].replace(/\{(\d)\}/g, (_, i) => args[i] ?? '');
  if (!s) return [];
  const m = /^(GO\s*TO|GO\s*SUB|DEF\s*FN|[A-Za-z]+)\s*(.*)$/s.exec(s);
  const kw = m ? m[1].toUpperCase().replace(/\s+/g, '') : '';
  const rest = m ? m[2].trim() : '';
  const colour = v => { const n = Number(v); return /^\d$/.test(v.trim()) && (n < 8 || kw !== 'BORDER') ? `${esc(L.colours[n])} (${n})` : codeTag(v); };
  const args = splitTop(rest, ',').map(a => a.trim());
  let out;
  switch (kw) {
    case 'REM': return [L.REM];
    case 'PRINT': {
      if (!rest) return [L.printEmpty];
      const items = [];
      let comma = false;
      for (const piece of splitTop(rest, ";'")) {
        let cells = splitTop(piece, ',').map(x => x.trim());
        const at = /^AT\s+(.*)$/is.exec(cells[0]);
        if (at) { items.push(tr('pAt', codeTag(at[1]), codeTag(cells[1] || ''))); cells = cells.slice(2); if (!cells.length) continue; }
        if (cells.filter(Boolean).length > 1 || (!at && cells.length > 1)) comma = true;
        for (const it of cells.filter(Boolean)) {
          const tab = /^TAB\s+(.*)$/is.exec(it);
          if (it.startsWith('"')) items.push(tr('pText', codeTag(it)));
          else if (tab) items.push(tr('pTab', codeTag(tab[1])));
          else if (/^(INK|PAPER|BRIGHT|FLASH|INVERSE|OVER)\s/i.test(it)) items.push(tr('pColour', codeTag(it)));
          else items.push(tr('pValue', codeTag(it)));
        }
      }
      out = tr('print', items.join(L.then));
      if (rest.endsWith(';')) out += ' ' + L.printStay;
      else if (comma) out += ' ' + L.printComma;
      break;
    }
    case 'LET': {
      const eq = splitTop(rest, '=');
      const name = eq[0].trim(), value = rest.slice(eq[0].length + 1);
      out = tr(name.endsWith('$') ? 'letText' : /^\s*-?[\d.]+\s*$/.test(value) ? 'letPut' : 'let', codeTag(name), codeTag(value));
      break;
    }
    case 'INPUT': {
      const items = splitTop(rest, ';,').map(x => x.trim()).filter(Boolean);
      const ask = items.filter(i => i.startsWith('"')), vars = items.filter(i => !i.startsWith('"'));
      out = tr('input', vars.map(codeTag).join(', '));
      if (ask.length) out += ' ' + tr('inputAsk', codeTag(ask[0]));
      break;
    }
    case 'IF': {
      const at = findWord(rest, 'THEN');
      const cond = at < 0 ? rest : rest.slice(0, at), body = at < 0 ? '' : rest.slice(at + 4);
      const inner = explainStatements(body, L);
      return [`${tr('if', codeTag(cond))}<ul>${inner.map(x => `<li>${x}</li>`).join('')}</ul>${L.ifElse}`];
    }
    case 'FOR': {
      const eq = rest.indexOf('='), to = findWord(rest, 'TO'), st = findWord(rest, 'STEP');
      const v = rest.slice(0, eq), from = rest.slice(eq + 1, to < 0 ? undefined : to);
      const end = to < 0 ? '' : rest.slice(to + 2, st < 0 ? undefined : st);
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
      if (/^[A-Za-z][A-Za-z0-9]*\$?\s*(\([^)]*\))?\s*=/.test(s)) return [tr('noLet', codeTag('LET ' + s))];
      return [tr('unknown', codeTag(s))];
  }
  // Short notes about functions used inside the instruction.
  const bare = outsideQuotes(s).toUpperCase(), notes = [];
  const has = w => new RegExp(`(^|[^A-Z0-9])${w.replace('$', '\\$')}([^A-Z0-9$]|$)`).test(bare);
  if (has('RND')) notes.push(L.fRND);
  if (has('INT')) notes.push(L.fINT);
  if (has('INKEY$')) notes.push(L.fINKEY);
  if (has('SQR')) notes.push(L.fSQR);
  if (has('ABS')) notes.push(L.fABS);
  if (has('LEN')) notes.push(L.fLEN);
  if (has('PI')) notes.push(L.fPI);
  if (has('SIN') || has('COS')) notes.push(L.fSIN);
  if (has('CHR$')) notes.push(L.fCHR);
  return [notes.length ? `${out} <span class="fn-note">${notes.join(' ')}</span>` : out];
}

// Explains a run of instructions separated by colons. IF takes the rest of the line.
function explainStatements(text, L) {
  const pieces = splitTop(text, ':');
  const out = [];
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i].trim();
    if (!p) continue;
    if (/^REM(\s|$)/i.test(p)) { out.push(L.REM); break; }
    if (/^IF\s/i.test(p)) { out.push(...explainStatement(pieces.slice(i).join(':'), L)); break; }
    out.push(...explainStatement(p, L));
  }
  return out;
}

export function explainLine(text, lang = 'en') {
  const L = T[lang] || T.en;
  if (!text.trim()) return null;
  const m = /^\s*(\d+)\s*(.*)$/s.exec(text);
  if (!m) return { num: null, parts: [L.noNumber] };
  const parts = explainStatements(m[2], L);
  return { num: m[1], parts: parts.length ? parts : [L.empty] };
}
