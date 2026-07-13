import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
const scan = JSON.parse(fs.readFileSync(path.join(root, '.understand-anything', 'intermediate', 'scan-result.json'), 'utf8'));
const sourceFilePaths = scan.files.map(f => f.path);

const input = {
  projectRoot: root,
  sourceFilePaths,
  gitCommitHash: '7f2009739c60d665d56297c2bd53b7745b7642a5',
};

fs.writeFileSync(path.join(root, '.understand-anything', 'intermediate', 'fingerprint-input.json'), JSON.stringify(input, null, 2), 'utf8');
console.log(`Wrote fingerprint-input.json with ${sourceFilePaths.length} source files`);
