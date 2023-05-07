const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
const options = {encoding: 'utf-8'};

const readData = (filePath, options) => {
  const stream = new fs.ReadStream(filePath, options);  
  stream.on('readable', async function() {
    const data = await stream.read();
    if (data != null) console.log('\x1b[32m', data, '\x1b[0m');
})
}

readData(filePath, options);
