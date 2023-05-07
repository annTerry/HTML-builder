const fs = require('fs/promises');
const path = require('node:path');

const targetFolder = path.join(__dirname, 'secret-folder');

const getFilesFromDirectory = async (dir) => {
    const filesInDir = await fs.readdir(dir);
    const files = await Promise.all(
        filesInDir.map(async (file) => {
            if (file) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile()) {
                    const ext = path.extname(file);
                    const name = path.basename(file, ext);
                    const size = `${stats.size / 1024}Kb`;
                    return { name: name, ext: ext.substring(1), size: size };
                }
            }
        })
    );
    return files;
};

const listFiles = async (dir) => {
    let files = await getFilesFromDirectory(dir);
    files.forEach(data => {
        if (data) {
            console.log(`\x1b[36m${data.name}\x1b[0m - \x1b[34m${data.ext}\x1b[0m - \x1b[33m${data.size}\x1b[0m`);
        }
    });    
}

listFiles(targetFolder);
