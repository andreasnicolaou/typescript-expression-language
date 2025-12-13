/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Read size limits from package.json
const getSizeLimits = () => {
  const packageJsonPath = path.resolve(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson['bundle-size']) {
    throw new Error('No bundle-size configuration found in package.json');
  }

  const limits = {};
  for (const config of packageJson['bundle-size']) {
    // Parse limit like "40kB" to number in bytes
    const limitMatch = config.limit.match(/^(\d+)kB?$/i);
    if (!limitMatch) {
      throw new Error(`Invalid limit format: ${config.limit}`);
    }
    limits[config.path] = parseInt(limitMatch[1]) * 1024;
  }

  return limits;
};

const getFileSize = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath);
  const gzipSize = zlib.gzipSync(content).length;

  return {
    raw: stats.size,
    gzip: gzipSize,
  };
};

const formatBytes = (bytes) => {
  return (bytes / 1024).toFixed(2) + ' KB';
};

const checkBundleSizes = () => {
  console.log('📦 Checking bundle sizes...\n');

  let hasErrors = false;
  const sizeLimits = getSizeLimits();

  for (const [filePath, limitBytes] of Object.entries(sizeLimits)) {
    const fullPath = path.resolve(projectRoot, filePath);
    const size = getFileSize(fullPath);

    if (!size) {
      console.log(`❌ ${filePath}: File not found`);
      hasErrors = true;
      continue;
    }

    const isOverLimit = size.gzip > limitBytes;
    const status = isOverLimit ? '❌' : '✅';
    const percentage = ((size.gzip / limitBytes) * 100).toFixed(1);
    const limitKB = (limitBytes / 1024).toFixed(0);

    console.log(`${status} ${filePath}:`);
    console.log(`   Raw: ${formatBytes(size.raw)}`);
    console.log(`   Gzipped: ${formatBytes(size.gzip)} / ${limitKB} KB (${percentage}%)`);
    console.log('');

    if (isOverLimit) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log('💥 Some bundles exceed size limits!');
    process.exit(1);
  } else {
    console.log('🎉 All bundles are within size limits!');
  }
};

// Check if dist directory exists
const distPath = path.resolve(projectRoot, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ dist directory not found. Please run "npm run build" first.');
  process.exit(1);
}

checkBundleSizes();
