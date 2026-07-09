import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: node ua-arch-analyze.js <input.json> <output.json>');
  process.exit(1);
}

const patternFor = (group, filePath) => {
  const lowerGroup = group.toLowerCase();
  const base = path.posix.basename(filePath).toLowerCase();
  if (['components', 'views', 'pages', 'ui', 'layouts', 'screens', 'src'].includes(lowerGroup)) return 'ui';
  if (['config', 'constants', 'env', 'settings'].includes(lowerGroup)) return 'config';
  if (['docs', 'documentation', 'wiki'].includes(lowerGroup)) return 'documentation';
  if (['assets', 'static', 'public'].includes(lowerGroup)) return 'assets';
  if (base.endsWith('.md') || base.endsWith('.rst')) return 'documentation';
  if (base === 'package.json' || base === 'vite.config.js' || base === 'eslint.config.js') return 'config';
  if (base === 'index.html' || base === 'main.jsx' || base === 'main.tsx') return 'entry';
  return 'root';
};

const topGroup = (filePath) => {
  const parts = filePath.split(/[\\/]/).filter(Boolean);
  if (parts.length === 0) return 'root';
  if (parts.length === 1) return 'root';
  return parts[0];
};

try {
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const fileNodes = input.fileNodes || [];
  const nodeById = new Map(fileNodes.map((node) => [node.id, node]));

  const directoryGroups = {};
  const nodeTypeGroups = {};
  const patternMatches = {};
  const fileFanIn = {};
  const fileFanOut = {};

  for (const node of fileNodes) {
    const group = topGroup(node.filePath || node.id);
    directoryGroups[group] = directoryGroups[group] || [];
    directoryGroups[group].push(node.id);
    nodeTypeGroups[node.type] = nodeTypeGroups[node.type] || [];
    nodeTypeGroups[node.type].push(node.id);
    patternMatches[group] = patternMatches[group] || patternFor(group, node.filePath || '');
    fileFanIn[node.id] = 0;
    fileFanOut[node.id] = 0;
  }

  const importEdges = (input.importEdges || []).filter(
    (edge) => nodeById.has(edge.source) && nodeById.has(edge.target)
  );
  for (const edge of importEdges) {
    fileFanOut[edge.source] = (fileFanOut[edge.source] || 0) + 1;
    fileFanIn[edge.target] = (fileFanIn[edge.target] || 0) + 1;
  }

  const groupForId = (id) => topGroup(nodeById.get(id)?.filePath || id);
  const interMap = new Map();
  const intraGroupDensity = {};
  const groupTotals = {};
  const groupInternal = {};

  for (const edge of importEdges) {
    const from = groupForId(edge.source);
    const to = groupForId(edge.target);
    groupTotals[from] = (groupTotals[from] || 0) + 1;
    groupTotals[to] = (groupTotals[to] || 0) + 1;
    if (from === to) {
      groupInternal[from] = (groupInternal[from] || 0) + 1;
    } else {
      const key = `${from}\u0000${to}`;
      interMap.set(key, (interMap.get(key) || 0) + 1);
    }
  }

  for (const group of Object.keys(directoryGroups)) {
    const internalEdges = groupInternal[group] || 0;
    const totalEdges = groupTotals[group] || 0;
    intraGroupDensity[group] = {
      internalEdges,
      totalEdges,
      density: totalEdges ? internalEdges / totalEdges : 0
    };
  }

  const crossMap = new Map();
  for (const edge of input.allEdges || []) {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) continue;
    const key = `${source.type}\u0000${target.type}\u0000${edge.type}`;
    crossMap.set(key, (crossMap.get(key) || 0) + 1);
  }

  const dependencyDirection = [];
  for (const [key, count] of interMap) {
    const [from, to] = key.split('\u0000');
    const reverse = interMap.get(`${to}\u0000${from}`) || 0;
    if (count > reverse) dependencyDirection.push({ dependent: from, dependsOn: to });
  }

  const result = {
    scriptCompleted: true,
    directoryGroups,
    nodeTypeGroups,
    crossCategoryEdges: [...crossMap.entries()].map(([key, count]) => {
      const [fromType, toType, edgeType] = key.split('\u0000');
      return { fromType, toType, edgeType, count };
    }),
    interGroupImports: [...interMap.entries()].map(([key, count]) => {
      const [from, to] = key.split('\u0000');
      return { from, to, count };
    }),
    intraGroupDensity,
    patternMatches,
    deploymentTopology: {
      hasDockerfile: false,
      hasCompose: false,
      hasK8s: false,
      hasTerraform: false,
      hasCI: false,
      infraFiles: []
    },
    dataPipeline: {
      schemaFiles: [],
      migrationFiles: [],
      dataModelFiles: [],
      apiHandlerFiles: []
    },
    docCoverage: {
      groupsWithDocs: Object.entries(directoryGroups).filter(([, ids]) =>
        ids.some((id) => nodeById.get(id)?.type === 'document')
      ).length,
      totalGroups: Object.keys(directoryGroups).length,
      coverageRatio: Object.keys(directoryGroups).length
        ? Object.entries(directoryGroups).filter(([, ids]) =>
            ids.some((id) => nodeById.get(id)?.type === 'document')
          ).length / Object.keys(directoryGroups).length
        : 0,
      undocumentedGroups: Object.entries(directoryGroups)
        .filter(([, ids]) => !ids.some((id) => nodeById.get(id)?.type === 'document'))
        .map(([group]) => group)
    },
    dependencyDirection,
    fileStats: {
      totalFileNodes: fileNodes.length,
      filesPerGroup: Object.fromEntries(
        Object.entries(directoryGroups).map(([group, ids]) => [group, ids.length])
      ),
      nodeTypeCounts: Object.fromEntries(
        Object.entries(nodeTypeGroups).map(([type, ids]) => [type, ids.length])
      )
    },
    fileFanIn,
    fileFanOut
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
