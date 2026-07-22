const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const intermediate = path.join(root, '.understand-anything', 'intermediate')
const files = fs
  .readdirSync(intermediate)
  .filter((name) => /^batch-\d+(?:-part-\d+)?\.json$/.test(name))
  .sort((a, b) => a.localeCompare(b))

const nodes = []
const edges = []
const seenNodes = new Set()
const seenEdges = new Set()

for (const file of files) {
  const fragment = JSON.parse(fs.readFileSync(path.join(intermediate, file), 'utf8'))
  for (const node of fragment.nodes || []) {
    if (!seenNodes.has(node.id)) {
      seenNodes.add(node.id)
      nodes.push(node)
    }
  }
  for (const edge of fragment.edges || []) {
    const key = `${edge.source}\0${edge.target}\0${edge.type}`
    if (!seenEdges.has(key)) {
      seenEdges.add(key)
      edges.push(edge)
    }
  }
}

const graph = { nodes, edges }
fs.writeFileSync(
  path.join(intermediate, 'merged-graph.json'),
  JSON.stringify(graph, null, 2),
)
console.log(`Merged ${files.length} fragments into ${nodes.length} nodes and ${edges.length} edges.`)
