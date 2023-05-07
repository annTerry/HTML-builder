const { error } = require('node:console');
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin
});

const filePath = path.join(__dirname, 'text.txt');

const simpleError = (error) => {
    if (error) {
        console.log(error);
    }
}

fs.writeFile(filePath, '', simpleError);

console.log('\x1b[32mInput text for file, Ctrl+C or single word exit on string for finish\x1b[0m');

rl.on('line', (input) => {  
  if (input === 'exit') {
    rl.close();     
  } else {    
    fs.appendFile(filePath, input +'\n', simpleError);  
  }
});

process.on('SIGINT', function() {
    let inputString = rl.line;
    if (inputString !== 'exit') fs.appendFile(filePath, inputString, simpleError);
    process.exit();
});

process.on('exit', () => {
  console.log('\n\x1b[36mThis is the end. Buy!\x1b[0m');
});
