import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const appDirectory = path.resolve('app');
const outputFile = path.resolve('lib/generated-sitemap-routes.json');
const pageFilePattern = /^page\.(?:js|jsx|ts|tsx)$/;
const excludedRoutes = new Set(['/blog/tim-kiem/']);

async function findPageDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const directories = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => findPageDirectories(path.join(directory, entry.name))),
  );
  const hasPage = entries.some((entry) => entry.isFile() && pageFilePattern.test(entry.name));
  return [...(hasPage ? [directory] : []), ...directories.flat()];
}

function directoryToRoute(directory) {
  const segments = path.relative(appDirectory, directory).split(path.sep).filter(Boolean);
  const publicSegments = segments.filter((segment) => !/^\(.+\)$/.test(segment));

  if (publicSegments.some((segment) => segment.startsWith('_') || segment.includes('[') || segment.startsWith('@'))) {
    return null;
  }

  return publicSegments.length ? `/${publicSegments.join('/')}/` : '/';
}

const routes = (await findPageDirectories(appDirectory))
  .map(directoryToRoute)
  .filter((route) => route && !excludedRoutes.has(route))
  .sort((a, b) => a.localeCompare(b, 'vi'));

await writeFile(outputFile, `${JSON.stringify(routes, null, 2)}\n`, 'utf8');
console.log(`Generated ${routes.length} static sitemap routes.`);
