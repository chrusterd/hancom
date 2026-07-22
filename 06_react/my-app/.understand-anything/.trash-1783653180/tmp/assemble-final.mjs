import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
const interDir = path.join(root, '.understand-anything', 'intermediate');

const assembled = JSON.parse(fs.readFileSync(path.join(interDir, 'assembled-graph.json'), 'utf8'));
const layers = JSON.parse(fs.readFileSync(path.join(interDir, 'layers.json'), 'utf8'));
const tour = JSON.parse(fs.readFileSync(path.join(interDir, 'tour.json'), 'utf8'));

const graph = {
  version: '1.0.0',
  project: {
    name: 'my-app',
    languages: ['css', 'html', 'javascript', 'json', 'markdown'],
    frameworks: ['React', 'Vite', 'Tailwind CSS'],
    description: 'Korean React/Vite bootcamp practice project — numbered lesson folders (17–30) under src/components/ demonstrate progressive React concepts (functional components, props, conditional rendering, list rendering, hooks/state, MUI, Tailwind CSS), while src/App.jsx/main.jsx form the app entry point.',
    analyzedAt: '2026-07-10T03:11:38.000Z',
    gitCommitHash: '7f2009739c60d665d56297c2bd53b7745b7642a5',
  },
  nodes: assembled.nodes,
  edges: assembled.edges,
  layers,
  tour,
};

fs.writeFileSync(path.join(interDir, 'final-graph.json'), JSON.stringify(graph, null, 2), 'utf8');
console.log(`Assembled final graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${graph.layers.length} layers, ${graph.tour.length} tour steps`);
