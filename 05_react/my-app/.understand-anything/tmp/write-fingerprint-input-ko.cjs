const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const intermediate = path.join(root, '.understand-anything', 'intermediate')
const scan = JSON.parse(fs.readFileSync(path.join(intermediate, 'scan-result.json'), 'utf8'))

fs.writeFileSync(
  path.join(intermediate, 'fingerprint-input.json'),
  JSON.stringify(
    {
      projectRoot: root,
      sourceFilePaths: scan.files.map((file) => file.path),
      gitCommitHash: 'no-git',
    },
    null,
    2,
  ),
)
