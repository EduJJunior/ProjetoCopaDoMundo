const fs = require('fs');
const path = require('path');

const legacyPath = path.join(__dirname, '../legacy-root-backup/data/mockData.ts');
const outPath = path.join(__dirname, '../data/mockData.ts');

const legacy = fs.readFileSync(legacyPath, 'utf8');
const idx = legacy.indexOf('export type CardItem');
const album = legacy.slice(0, idx);

const type = `export type CardItem = {
  id: string;
  nome: string;
  selecao: string;
  posicao: string;
  curiosidade: string;
  imagem: any;
  type?: 'player' | 'team' | 'stadium' | 'mascot' | 'coach';
  title?: string;
  subtitle?: string;
  description?: string;
  stats?: string;
  curiosity?: string;
};
`;

fs.writeFileSync(outPath, album + type, 'utf8');
console.log('Restored mockData with', (album.match(/id: '/g) || []).length, 'items');
