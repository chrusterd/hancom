const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const ua = path.join(root, '.understand-anything')
const intermediate = path.join(ua, 'intermediate')
const source = path.join(intermediate, 'domain-analysis.json')
const target = path.join(ua, 'domain-graph.json')

const graph = JSON.parse(fs.readFileSync(source, 'utf8'))
fs.writeFileSync(target, JSON.stringify(graph, null, 2))

for (const name of ['domain-analysis.json', 'domain-context.json']) {
  const filePath = path.join(intermediate, name)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

console.log(`Saved ${target}`)
