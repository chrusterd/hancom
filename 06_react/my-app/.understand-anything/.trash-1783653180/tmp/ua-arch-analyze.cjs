'use strict';

const fs = require('fs');
const path = require('path');

function fail(msg) {
  process.stderr.write('ERROR: ' + msg + '\n');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath) fail('usage: node ua-arch-analyze.js <input.json> <output.json>');

let input;
try {
  input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
} catch (e) {
  fail('failed to read/parse input: ' + e.message);
}

const fileNodes = input.fileNodes || [];
const importEdges = input.importEdges || [];
const allEdges = input.allEdges || [];

// ---------- A. Directory Grouping ----------
function normalize(p) {
  return p.split(path.win32.sep).join('/');
}

const paths = fileNodes.map(n => normalize(n.filePath || n.name || ''));

function commonPrefix(strs) {
  if (strs.length === 0) return '';
  let prefixParts = strs[0].split('/');
  for (let i = 1; i < strs.length; i++) {
    const parts = strs[i].split('/');
    let j = 0;
    while (j < prefixParts.length && j < parts.length && prefixParts[j] === parts[j]) j++;
    prefixParts = prefixParts.slice(0, j);
    if (prefixParts.length === 0) break;
  }
  // only keep directory-level common prefix (drop trailing filename-only match if no slash context)
  return prefixParts.length ? prefixParts.join('/') + '/' : '';
}

// only consider directory paths (exclude filename) when computing common prefix for grouping
const dirPaths = fileNodes.map(n => {
  const p = normalize(n.filePath || n.name || '');
  const idx = p.lastIndexOf('/');
  return idx >= 0 ? p.slice(0, idx) : '';
});

let prefix = commonPrefix(dirPaths.filter(d => d.length > 0));
if (dirPaths.some(d => d.length === 0)) {
  // some files at root -> no common prefix beyond root
  prefix = '';
}

const directoryGroups = {};
const extGroupCache = {};

function extGroup(fileName) {
  const base = fileName;
  if (/\.test\.|\.spec\./.test(base)) return 'test';
  if (/\.config\./.test(base)) return 'config';
  const ext = path.extname(base).replace('.', '') || 'noext';
  return ext;
}

const allFlat = dirPaths.every(d => d === dirPaths[0]);

for (const node of fileNodes) {
  const p = normalize(node.filePath || node.name || '');
  const idx = p.lastIndexOf('/');
  const dir = idx >= 0 ? p.slice(0, idx) : '';
  let group;
  if (allFlat && dirPaths.filter(d => d === dir).length === fileNodes.length) {
    // flat structure - group by extension pattern
    group = extGroup(node.name || p);
  } else {
    let rest = dir;
    if (prefix && rest.startsWith(prefix.slice(0, -1))) {
      rest = rest.slice(prefix.length - 1);
      if (rest.startsWith('/')) rest = rest.slice(1);
    } else if (prefix === '' ) {
      // group by first segment of full dir (or root)
    }
    if (dir === '') {
      group = 'root';
    } else {
      const segs = (prefix ? rest : dir).split('/').filter(Boolean);
      group = segs.length > 0 ? segs[0] : 'root';
      if (!prefix) {
        group = dir.split('/')[0];
      }
    }
  }
  if (!directoryGroups[group]) directoryGroups[group] = [];
  directoryGroups[group].push(node.id);
}

// ---------- B. Node Type Grouping ----------
const nodeTypeGroups = {};
for (const node of fileNodes) {
  const t = node.type || 'file';
  if (!nodeTypeGroups[t]) nodeTypeGroups[t] = [];
  nodeTypeGroups[t].push(node.id);
}

// ---------- C. Import Adjacency Matrix ----------
const fileFanOut = {};
const fileFanIn = {};
const adjacency = {};
for (const edge of importEdges) {
  if (!adjacency[edge.source]) adjacency[edge.source] = [];
  adjacency[edge.source].push(edge.target);
  fileFanOut[edge.source] = (fileFanOut[edge.source] || 0) + 1;
  fileFanIn[edge.target] = (fileFanIn[edge.target] || 0) + 1;
}

const idToGroup = {};
for (const [group, ids] of Object.entries(directoryGroups)) {
  for (const id of ids) idToGroup[id] = group;
}

const groupImportsFrom = {}; // group -> set of groups it imports from
const groupImportedBy = {}; // group -> set of groups that import it
for (const edge of importEdges) {
  const sg = idToGroup[edge.source];
  const tg = idToGroup[edge.target];
  if (!sg || !tg) continue;
  if (!groupImportsFrom[sg]) groupImportsFrom[sg] = new Set();
  groupImportsFrom[sg].add(tg);
  if (!groupImportedBy[tg]) groupImportedBy[tg] = new Set();
  groupImportedBy[tg].add(sg);
}

// ---------- D. Cross-Category Dependency Analysis ----------
function typeOf(id, nodesById) {
  const n = nodesById[id];
  return n ? n.type : (id.split(':')[0] || 'unknown');
}

const nodesById = {};
for (const n of fileNodes) nodesById[n.id] = n;

const crossCategoryMap = {};
for (const edge of allEdges) {
  const ft = typeOf(edge.source, nodesById);
  const tt = typeOf(edge.target, nodesById);
  if (ft === tt) continue; // only cross-category
  const key = ft + '|' + tt + '|' + edge.type;
  crossCategoryMap[key] = (crossCategoryMap[key] || 0) + 1;
}
const crossCategoryEdges = Object.entries(crossCategoryMap).map(([key, count]) => {
  const [fromType, toType, edgeType] = key.split('|');
  return { fromType, toType, edgeType, count };
});

// ---------- E. Inter-Group Import Frequency ----------
const interGroupMap = {};
for (const edge of importEdges) {
  const sg = idToGroup[edge.source];
  const tg = idToGroup[edge.target];
  if (!sg || !tg || sg === tg) continue;
  const key = sg + '->' + tg;
  interGroupMap[key] = (interGroupMap[key] || 0) + 1;
}
const interGroupImports = Object.entries(interGroupMap).map(([key, count]) => {
  const [from, to] = key.split('->');
  return { from, to, count };
});

// ---------- F. Intra-Group Import Density ----------
const intraGroupDensity = {};
for (const group of Object.keys(directoryGroups)) {
  let internalEdges = 0;
  let totalEdges = 0;
  for (const edge of importEdges) {
    const sg = idToGroup[edge.source];
    const tg = idToGroup[edge.target];
    if (sg !== group && tg !== group) continue;
    totalEdges++;
    if (sg === group && tg === group) internalEdges++;
  }
  intraGroupDensity[group] = {
    internalEdges,
    totalEdges,
    density: totalEdges > 0 ? +(internalEdges / totalEdges).toFixed(3) : 0
  };
}

// ---------- G. Directory Pattern Matching ----------
const dirPatternTable = [
  { pats: ['routes', 'api', 'controllers', 'endpoints', 'handlers'], label: 'api' },
  { pats: ['services', 'core', 'lib', 'domain', 'logic'], label: 'service' },
  { pats: ['models', 'db', 'data', 'persistence', 'repository', 'entities'], label: 'data' },
  { pats: ['components', 'views', 'pages', 'ui', 'layouts', 'screens'], label: 'ui' },
  { pats: ['middleware', 'plugins', 'interceptors', 'guards'], label: 'middleware' },
  { pats: ['utils', 'helpers', 'common', 'shared', 'tools'], label: 'utility' },
  { pats: ['config', 'constants', 'env', 'settings'], label: 'config' },
  { pats: ['__tests__', 'test', 'tests', 'spec', 'specs'], label: 'test' },
  { pats: ['types', 'interfaces', 'schemas', 'contracts', 'dtos'], label: 'types' },
  { pats: ['hooks'], label: 'hooks' },
  { pats: ['store', 'state', 'reducers', 'actions', 'slices'], label: 'state' },
  { pats: ['assets', 'static', 'public'], label: 'assets' },
  { pats: ['migrations'], label: 'data' },
  { pats: ['management', 'commands'], label: 'config' },
  { pats: ['templatetags'], label: 'utility' },
  { pats: ['signals'], label: 'service' },
  { pats: ['serializers'], label: 'api' },
  { pats: ['cmd'], label: 'entry' },
  { pats: ['internal'], label: 'service' },
  { pats: ['pkg'], label: 'utility' },
  { pats: ['dto', 'request', 'response'], label: 'types' },
  { pats: ['entity'], label: 'data' },
  { pats: ['controller'], label: 'api' },
  { pats: ['routers'], label: 'api' },
  { pats: ['composables'], label: 'service' },
  { pats: ['blueprints'], label: 'api' },
  { pats: ['mailers', 'jobs', 'channels'], label: 'service' },
  { pats: ['bin'], label: 'entry' },
  { pats: ['docs', 'documentation', 'wiki'], label: 'documentation' },
  { pats: ['deploy', 'deployment', 'infra', 'infrastructure'], label: 'infrastructure' },
  { pats: ['.github', '.gitlab', '.circleci'], label: 'ci-cd' },
  { pats: ['k8s', 'kubernetes', 'helm', 'charts'], label: 'infrastructure' },
  { pats: ['terraform', 'tf'], label: 'infrastructure' },
  { pats: ['docker'], label: 'infrastructure' },
  { pats: ['sql', 'database', 'schema'], label: 'data' }
];

const patternMatches = {};
for (const group of Object.keys(directoryGroups)) {
  const lg = group.toLowerCase();
  let matched = null;
  for (const entry of dirPatternTable) {
    if (entry.pats.includes(lg)) { matched = entry.label; break; }
  }
  if (matched) patternMatches[group] = matched;
}

// ---------- H. Deployment Topology Detection ----------
const infraFiles = [];
let hasDockerfile = false, hasCompose = false, hasK8s = false, hasTerraform = false, hasCI = false;
for (const node of fileNodes) {
  const p = normalize(node.filePath || node.name || '');
  const base = path.basename(p);
  if (/^Dockerfile/.test(base)) { hasDockerfile = true; infraFiles.push(p); }
  if (/^docker-compose/.test(base)) { hasCompose = true; infraFiles.push(p); }
  if (/\.tf$|\.tfvars$/.test(base)) { hasTerraform = true; infraFiles.push(p); }
  if (/^\.github\/workflows\//.test(p) || /^\.gitlab-ci\.yml$/.test(base) || base === 'Jenkinsfile') { hasCI = true; infraFiles.push(p); }
  if (/k8s|kubernetes|helm/i.test(p)) { hasK8s = true; infraFiles.push(p); }
}

const deploymentTopology = {
  hasDockerfile, hasCompose, hasK8s, hasTerraform, hasCI,
  infraFiles: Array.from(new Set(infraFiles))
};

// ---------- I. Data Pipeline Detection ----------
const schemaFiles = [];
const migrationFiles = [];
const dataModelFiles = [];
const apiHandlerFiles = [];
for (const node of fileNodes) {
  const p = normalize(node.filePath || node.name || '');
  if (/\.sql$/.test(p) || /\.graphql$/.test(p) || /\.proto$/.test(p) || /schema/i.test(p)) schemaFiles.push(p);
  if (/migrations\//.test(p)) migrationFiles.push(p);
  if (/models?\//.test(p) || /entities\//.test(p)) dataModelFiles.push(p);
  if (/routes\/|api\/|controllers\/|endpoints\/|handlers\//.test(p)) apiHandlerFiles.push(p);
}

const dataPipeline = { schemaFiles, migrationFiles, dataModelFiles, apiHandlerFiles };

// ---------- J. Documentation Coverage ----------
const docFiles = (nodeTypeGroups['document'] || []).map(id => normalize(nodesById[id].filePath || ''));
const groupsWithDocsSet = new Set();
for (const group of Object.keys(directoryGroups)) {
  const hasReadme = directoryGroups[group].some(id => /readme/i.test(nodesById[id].name || ''));
  const hasDocRef = docFiles.some(dp => dp.toLowerCase().includes(group.toLowerCase()));
  if (hasReadme || hasDocRef) groupsWithDocsSet.add(group);
}
const totalGroups = Object.keys(directoryGroups).length;
const groupsWithDocs = groupsWithDocsSet.size;
const undocumentedGroups = Object.keys(directoryGroups).filter(g => !groupsWithDocsSet.has(g));

const docCoverage = {
  groupsWithDocs,
  totalGroups,
  coverageRatio: totalGroups > 0 ? +(groupsWithDocs / totalGroups).toFixed(3) : 0,
  undocumentedGroups
};

// ---------- K. Dependency Direction ----------
const dependencyDirection = [];
const seenPairs = new Set();
for (const { from, to, count } of interGroupImports) {
  const reverseKey = to + '->' + from;
  const reverseCount = interGroupMap[reverseKey] || 0;
  const pairKey = [from, to].sort().join('|');
  if (seenPairs.has(pairKey)) continue;
  seenPairs.add(pairKey);
  if (count > reverseCount) {
    dependencyDirection.push({ dependent: from, dependsOn: to });
  } else if (reverseCount > count) {
    dependencyDirection.push({ dependent: to, dependsOn: from });
  }
}

// ---------- File Stats ----------
const filesPerGroup = {};
for (const [group, ids] of Object.entries(directoryGroups)) filesPerGroup[group] = ids.length;

const nodeTypeCounts = {};
for (const [t, ids] of Object.entries(nodeTypeGroups)) nodeTypeCounts[t] = ids.length;

const fileStats = {
  totalFileNodes: fileNodes.length,
  filesPerGroup,
  nodeTypeCounts
};

// Convert Sets in groupImportsFrom/groupImportedBy for optional inclusion (not required by spec but harmless omit)

const result = {
  scriptCompleted: true,
  directoryGroups,
  nodeTypeGroups,
  crossCategoryEdges,
  interGroupImports,
  intraGroupDensity,
  patternMatches,
  deploymentTopology,
  dataPipeline,
  docCoverage,
  dependencyDirection,
  fileStats,
  fileFanIn,
  fileFanOut
};

try {
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
} catch (e) {
  fail('failed to write output: ' + e.message);
}

process.exit(0);
