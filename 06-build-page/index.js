const fs = require('fs').promises;
const path = require('node:path');

const copyDir = async (oldDir, newDir) => {
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

const createBundle = async (stylesFolder, targetCss) => {
  const files = await fs.readdir(stylesFolder, { withFileTypes: true });
  await fs.writeFile(targetCss, '');
  for (const file of files) {
    if (file.isFile()) {
      const ext = path.extname(file.name);
      if (ext.toLowerCase() === '.css') {
        const fileToRead = await fs.readFile(path.join(stylesFolder, file.name), { encoding: 'utf-8' });
        if (fileToRead) {
          await fs.appendFile(targetCss, fileToRead);
        }
      }
    }
  }
}

const loadTemplate = async (templateFile) => {
  let htmlData = [];
  try {
    const data = await fs.readFile(templateFile, { encoding: 'utf-8' });
    htmlData = data.split('\n');
  }
  catch (err) {
    console.log(err);
  }
  return htmlData;
}


const loadComponent = async (filePath, resultData) => {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf-8' });
    resultData.push(data);
  }
  catch (err) {
    console.log(err);
  }
  return resultData;
}


const testAndPush = async (htmlString, resultData, componentsFolder) => {
  try {
    const templateBeginData = htmlString.split('{{');
    if (templateBeginData.length > 1) {
      for (let i = 0; i< templateBeginData.length; i++) {
        const part = templateBeginData[i];
        if (part.includes('}}')) {
          const endDataSplit = part.split('}}');
          if (endDataSplit[0].length > 0) {
            resultData = await loadComponent(path.join(componentsFolder, endDataSplit[0] + '.html'), resultData);
          }
          else {
            resultData.push('{{}}');
          }
          if (endDataSplit.length > 1) {
            resultData.push(endDataSplit[1]);
          }
        }
        else {
          resultData.push(part);
        }
      }
    }
    else {
      resultData.push(templateBeginData[0]);
    }
  }
  catch (err) {
    console.log(err);
  }
  return resultData;
}

const collectData = async (htmlData, componentsFolder) => {
  let resultData = [];
  try {
    for (const htmlString of htmlData) {
      resultData = await testAndPush(htmlString, resultData, componentsFolder);
    }

  }
  catch (err) {
    console.log(err);
  }
  return resultData;
}

const checkTemplate = async (templateFile, componentsFolder) => {
  try {
    const htmlData = await loadTemplate(templateFile);
    const result = await collectData(htmlData, componentsFolder);
    return result;
  }
  catch (err) {
    console.log(err);
    return [];
  }
}

const writeAndReadComponents = async (templateFile, componentsFolder, targetHtml) => {
  try {
    const resultData = await checkTemplate(templateFile, componentsFolder);
    await fs.writeFile(targetHtml, resultData.join('\n'));
    console.log('\x1b[32mCreated!\x1b[0m');
  }
  catch (err) {
    console.log(err);
  }
}


const createHTML = async () => {
  const assetsFolder = path.join(__dirname, 'assets');
  const componentsFolder = path.join(__dirname, 'components');
  const templateFile = path.join(__dirname, 'template.html');
  const targetFolder = path.join(__dirname, 'project-dist');
  const stylesFolder = path.join(__dirname, 'styles');
  const targetHtml = path.join(targetFolder, 'index.html');
  const targetCss = path.join(targetFolder, 'style.css');
  await fs.rm(targetFolder, { recursive: true, force: true });
  await fs.mkdir(targetFolder, { recursive: true });
  await copyDir(assetsFolder, path.join(targetFolder, 'assets'));
  await createBundle(stylesFolder, targetCss);
  await writeAndReadComponents(templateFile, componentsFolder, targetHtml);
}

createHTML();