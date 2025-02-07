const fs = require('fs/promises');
const path = require('node:path');

const sourceFolder = path.join(__dirname, 'files');
const targetFolder = path.join(__dirname, 'files-copy');


async function copyDir(oldDir, newDir) {
    await fs.rm(newDir, { recursive: true, force: true });
    await fs.mkdir(newDir, { recursive: true });
    const files = await fs.readdir(oldDir, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            await fs.copyFile(path.join(oldDir, file.name), path.join(newDir, file.name));
        }
        else if (file.isDirectory()) {
            await copyDir(path.join(oldDir, file.name), path.join(newDir, file.name));
        }
    }
}

(async () => {
    await copyDir(sourceFolder, targetFolder);
    console.log('\x1b[32mFolder is copied\x1b[0m');
})();
