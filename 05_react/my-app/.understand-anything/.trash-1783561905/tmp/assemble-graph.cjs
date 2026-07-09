const fs = require('fs')
const path = require('path')

const root = process.argv[2]
const intermediate = path.join(root, '.understand-anything', 'intermediate')

const readJson = (name) =>
  JSON.parse(fs.readFileSync(path.join(intermediate, name), 'utf8'))

const scan = readJson('scan-result.json')
const merged = readJson('merged-graph.json')
const layersRaw = readJson('layers.json')
const tourRaw = readJson('tour.json')

const nodeIds = new Set(merged.nodes.map((node) => node.id))
const fileLevelTypes = new Set([
  'file',
  'config',
  'document',
  'service',
  'pipeline',
  'table',
  'schema',
  'resource',
  'endpoint',
])

const normalizeLayers = (layers) =>
  layers
    .map((layer) => ({
      id: layer.id,
      name: layer.name,
      description: layer.description,
      nodeIds: (layer.nodeIds || layer.nodes || [])
        .map((node) => (typeof node === 'string' ? node : node.id))
        .filter((id) => nodeIds.has(id)),
    }))
    .filter((layer) => layer.id && layer.name && layer.description && layer.nodeIds.length)

const normalizeTour = (tour) =>
  tour
    .map((step, index) => ({
      order: step.order ?? step.step ?? index + 1,
      title: step.title,
      description: step.description ?? step.content,
      nodeIds: (step.nodeIds || step.nodesToInspect || (step.nodeId ? [step.nodeId] : []))
        .map((node) => (typeof node === 'string' ? node : node.id))
        .filter((id) => nodeIds.has(id)),
      ...(step.languageLesson ? { languageLesson: step.languageLesson } : {}),
    }))
    .filter((step) => step.title && step.description && step.nodeIds.length)
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({ ...step, order: index + 1 }))

const layers = normalizeLayers(Array.isArray(layersRaw) ? layersRaw : layersRaw.layers || [])
const tour = normalizeTour(Array.isArray(tourRaw) ? tourRaw : tourRaw.steps || [])

const graph = {
  version: '1.0.0',
  project: {
    name: scan.name,
    languages: scan.languages,
    frameworks: scan.frameworks,
    description: scan.description,
    analyzedAt: new Date().toISOString(),
    gitCommitHash: 'no-git',
  },
  nodes: merged.nodes,
  edges: merged.edges,
  layers,
  tour,
}

const issues = []
const warnings = []

for (const node of graph.nodes) {
  if (!node.id || !node.type || !node.name || !node.summary) {
    issues.push(`Node '${node.id || '<missing>'}' is missing a required field`)
  }
  if (!Array.isArray(node.tags) || node.tags.length === 0) {
    issues.push(`Node '${node.id}' is missing tags`)
  }
}

for (const edge of graph.edges) {
  if (!nodeIds.has(edge.source)) issues.push(`Edge source '${edge.source}' not found`)
  if (!nodeIds.has(edge.target)) issues.push(`Edge target '${edge.target}' not found`)
}

const assigned = new Map()
for (const layer of layers) {
  for (const id of layer.nodeIds) {
    if (!nodeIds.has(id)) issues.push(`Layer '${layer.id}' references missing node '${id}'`)
    if (assigned.has(id)) issues.push(`Node '${id}' appears in multiple layers`)
    assigned.set(id, layer.id)
  }
}

for (const node of graph.nodes) {
  if (fileLevelTypes.has(node.type) && !assigned.has(node.id)) {
    issues.push(`File node '${node.id}' is not in any layer`)
  }
}

for (const step of tour) {
  for (const id of step.nodeIds) {
    if (!nodeIds.has(id)) issues.push(`Tour step ${step.order} references missing node '${id}'`)
  }
}

const connected = new Set()
for (const edge of graph.edges) {
  connected.add(edge.source)
  connected.add(edge.target)
}
for (const node of graph.nodes) {
  if (!connected.has(node.id)) warnings.push(`Node '${node.id}' has no edges`)
}

const review = {
  issues,
  warnings,
  stats: {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    totalLayers: graph.layers.length,
    tourSteps: graph.tour.length,
    nodeTypes: graph.nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1
      return acc
    }, {}),
    edgeTypes: graph.edges.reduce((acc, edge) => {
      acc[edge.type] = (acc[edge.type] || 0) + 1
      return acc
    }, {}),
  },
}

fs.writeFileSync(path.join(intermediate, 'assembled-graph.json'), JSON.stringify(graph, null, 2))
fs.writeFileSync(path.join(intermediate, 'review.json'), JSON.stringify(review, null, 2))
fs.writeFileSync(path.join(intermediate, 'tour.json'), JSON.stringify(tour, null, 2))
fs.writeFileSync(path.join(intermediate, 'layers.json'), JSON.stringify(layers, null, 2))

if (issues.length > 0) {
  console.error(`Validation found ${issues.length} issue(s).`)
  process.exit(1)
}

console.log(
  `Assembled graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${layers.length} layers, ${tour.length} tour steps.`,
)
