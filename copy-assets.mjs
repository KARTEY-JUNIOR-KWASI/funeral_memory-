import fs from 'node:fs';
import path from 'node:path';

function copyFolder(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} -> ${dest}`);
}

copyFolder('pages', 'dist/pages');
copyFolder('audio', 'dist/audio');
if (fs.existsSync('favicon.svg')) {
  fs.copyFileSync('favicon.svg', 'dist/favicon.svg');
}
if (fs.existsSync('programme.pdf')) {
  fs.copyFileSync('programme.pdf', 'dist/programme.pdf');
}
console.log('Static assets copy completed successfully.');
