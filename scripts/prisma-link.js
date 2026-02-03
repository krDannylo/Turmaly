/**
 * Cria junction no Windows para que @prisma/client encontre o client gerado em node_modules/.prisma/client.
 * Necessário no Prisma 7 no Windows quando o client é gerado em node_modules/@prisma/client.
 */
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const clientDir = path.join(projectRoot, 'node_modules', '@prisma', 'client');
const linkPath = path.join(clientDir, '.prisma');
const targetPath = path.join(projectRoot, 'node_modules', '.prisma');

if (process.platform !== 'win32') {
  process.exit(0);
}

if (!fs.existsSync(targetPath)) {
  process.exit(0);
}

if (fs.existsSync(linkPath)) {
  try {
    const stat = fs.lstatSync(linkPath);
    if (stat.isSymbolicLink()) process.exit(0);
  } catch {
    // ignorar
  }
}

try {
  if (fs.existsSync(linkPath)) {
    fs.rmdirSync(linkPath);
  }
  fs.symlinkSync(targetPath, linkPath, 'junction');
} catch (err) {
  console.warn('prisma-link: could not create junction:', err.message);
}
