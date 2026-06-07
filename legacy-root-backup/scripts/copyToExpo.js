const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const expoDir = path.join(root, 'expo-app');

function copy(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copy(path.join(src, file), path.join(dest, file));
    });
  } else {
    const content = fs.readFileSync(src);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
}

// List of project folders/files to copy into expo-app
const items = [
  'App.tsx',
  'tsconfig.json',
  'declarations.d.ts',
  'routes',
  'screens',
  'components',
  'data',
  'styles',
  'assets'
];

console.log('Copying project files to', expoDir);
items.forEach(item => {
  const src = path.join(root, item);
  const dest = path.join(expoDir, item);
  copy(src, dest);
  console.log('Copied', item);
});

console.log('\nAtenção: após rodar este script, você deve ajustar o package.json dentro de expo-app para usar dependências do Expo e rodar `npm install` dentro de expo-app.');
console.log('Recomendo: dentro da raiz, primeiro execute: `npx create-expo-app expo-app --template blank` e depois rode `node scripts/copyToExpo.js`.');
