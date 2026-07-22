const fs = require('fs');
const cp = require('child_process');

const fileLevelTypes = new Set([
  'file',
  'config',
  'document',
  'service',
  'pipeline',
  'table',
  'schema',
  'resource',
  'endpoint'
]);

const mergedPath = '.understand-anything/intermediate/merged-graph.json';
const inputPath = '.understand-anything/tmp/ua-arch-input.json';
const resultsPath = '.understand-anything/tmp/ua-arch-results.json';
const analyzerPath = '.understand-anything/tmp/ua-arch-analyze.js';
const layersPath = '.understand-anything/intermediate/layers.json';

const graph = JSON.parse(fs.readFileSync(mergedPath, 'utf8'));
const fileNodes = graph.nodes
  .filter((node) => fileLevelTypes.has(node.type))
  .map(({ id, type, name, filePath, summary, tags }) => ({
    id,
    type,
    name,
    filePath,
    summary,
    tags
  }));
const fileIds = new Set(fileNodes.map((node) => node.id));

const fileLevelEdges = graph.edges.filter(
  (edge) => fileIds.has(edge.source) && fileIds.has(edge.target)
);
const input = {
  fileNodes,
  importEdges: fileLevelEdges.filter((edge) => edge.type === 'imports'),
  allEdges: fileLevelEdges
};

fs.writeFileSync(inputPath, `${JSON.stringify(input, null, 2)}\n`);
cp.execFileSync(process.execPath, [analyzerPath, inputPath, resultsPath], { stdio: 'inherit' });

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
if (!results.scriptCompleted) {
  throw new Error('Architecture structural analysis did not complete.');
}

const byId = Object.fromEntries(fileNodes.map((node) => [node.id, node]));
const layers = [
  {
    id: 'layer:react-application',
    name: 'React Application',
    description:
      'The browser shell, React entry point, main component, and CSS files that render and style the Vite starter application.',
    nodeIds: [
      'file:index.html',
      'file:src/main.jsx',
      'file:src/App.jsx',
      'file:src/App.css',
      'file:src/index.css'
    ]
  },
  {
    id: 'layer:project-configuration',
    name: 'Project Configuration',
    description:
      'Package, linting, and Vite configuration files that define dependencies, development scripts, JSX tooling, and build behavior.',
    nodeIds: ['config:package.json', 'file:eslint.config.js', 'file:vite.config.js']
  },
  {
    id: 'layer:documentation-and-analysis',
    name: 'Documentation and Analysis',
    description:
      'Project documentation and Understand-Anything analysis scope settings that explain and control how this small app is understood.',
    nodeIds: ['document:README.md', 'file:.understand-anything/.understandignore']
  }
];

for (const layer of layers) {
  layer.nodeIds = layer.nodeIds.filter((id) => byId[id]);
}

const assigned = new Map();
for (const layer of layers) {
  for (const id of layer.nodeIds) {
    if (assigned.has(id)) {
      throw new Error(`Duplicate layer assignment for ${id}`);
    }
    assigned.set(id, layer.id);
  }
}

const missing = fileNodes.filter((node) => !assigned.has(node.id));
if (missing.length) {
  throw new Error(`Missing layer assignments: ${missing.map((node) => node.id).join(', ')}`);
}

const totalAssigned = layers.reduce((sum, layer) => sum + layer.nodeIds.length, 0);
if (totalAssigned !== fileNodes.length) {
  throw new Error(`Layer count mismatch: assigned ${totalAssigned}, expected ${fileNodes.length}`);
}

fs.writeFileSync(layersPath, `${JSON.stringify(layers, null, 2)}\n`);
console.log(
  layers.map((layer) => `${layer.name}: ${layer.nodeIds.length}`).join('\n')
);
