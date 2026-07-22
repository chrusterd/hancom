const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const ua = path.join(root, '.understand-anything')
const intermediate = path.join(ua, 'intermediate')
const tmp = path.join(ua, 'tmp')

const graph = JSON.parse(fs.readFileSync(path.join(intermediate, 'assembled-graph.json'), 'utf8'))
const scan = JSON.parse(fs.readFileSync(path.join(intermediate, 'scan-result.json'), 'utf8'))

fs.writeFileSync(path.join(ua, 'knowledge-graph.json'), JSON.stringify(graph, null, 2))
fs.writeFileSync(
  path.join(ua, 'meta.json'),
  JSON.stringify(
    {
      lastAnalyzedAt: graph.project.analyzedAt,
      gitCommitHash: graph.project.gitCommitHash,
      version: graph.version,
      analyzedFiles: scan.files.length,
    },
    null,
    2,
  ),
)

const trash = path.join(ua, `.trash-${Math.floor(Date.now() / 1000)}`)
fs.mkdirSync(trash, { recursive: true })

for (const name of fs.readdirSync(intermediate)) {
  if (name === 'scan-result.json') continue
  fs.renameSync(path.join(intermediate, name), path.join(trash, name))
}

if (fs.existsSync(tmp)) {
  fs.renameSync(tmp, path.join(trash, 'tmp'))
}

console.log(`Saved ${path.join(ua, 'knowledge-graph.json')}`)
console.log(`Saved ${path.join(ua, 'meta.json')}`)
