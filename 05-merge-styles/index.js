const fs = require('fs/promises');
const path = require('node:path');

const sourceFolder = path.join(__dirname, 'styles');
const targetFolder = path.join(__dirname, 'project-dist');
const targetFile = path.join(targetFolder, 'bundle.css');

const createBundle = async (source) => {
    const files = await fs.readdir(source, { withFileTypes: true });
    await fs.writeFile(targetFile, '');
    for (const file of files) {
        if (file.isFile()) {
            const ext = path.extname(file.name);
            if (ext.toLowerCase() === '.css') {
                const fileToRead = await fs.readFile(path.join(sourceFolder, file.name), { encoding: 'utf-8' });
                if (fileToRead) {
                    await fs.appendFile(targetFile, fileToRead);
                }
            }
        }
    }
}

(async () => {
    await createBundle(sourceFolder);
    console.log('\x1b[32mCSS Bundle is created\x1b[0m');
})();