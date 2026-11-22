const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const distDir = path.join(root, 'dist');

// Obtém o hash do último commit como versão para cache busting
let version;
try {
  version = execSync('git log -1 --format=%h', { cwd: root, encoding: 'utf-8' }).trim();
} catch (_) {
  version = String(Date.now());
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'login.html',
  'oauth-callback.html',
  'css',
  'components',
  'student',
  'task',
  'teacher'
];

for (const entry of filesToCopy) {
  const src = path.join(root, entry);
  const dest = path.join(distDir, entry);

  if (!fs.existsSync(src)) continue;

  if (fs.statSync(src).isDirectory()) {
    copyDir(src, dest);
  } else {
    const content = fs.readFileSync(src, 'utf-8');
    fs.writeFileSync(dest, addCacheBust(content));
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath, 'utf-8');
      fs.writeFileSync(destPath, addCacheBust(content));
    }
  }
}

function addCacheBust(content) {
  const isExternal = (url) => url.startsWith('http') || url.startsWith('//') || url.startsWith('data:');
  // src/href HTML attributes
  content = content.replace(/(src|href)=(")([^"]+\.(js|css))(")/g, (m, a, q, url, ext, q2) => {
    if (isExternal(url)) return m;
    return `${a}=${q}${url}?v=${version}${q2}`;
  });
  // import ... from '...'  (inline scripts)
  content = content.replace(/(from\s+)('|")([^'"]+\.js)('|")/g, (m, prefix, q, url, q2) => {
    if (isExternal(url)) return m;
    return `${prefix}${q}${url}?v=${version}${q2}`;
  });
  // import('...') dynamic imports
  content = content.replace(/(import\s*\()('|")([^'"]+\.js)('|")/g, (m, prefix, q, url, q2) => {
    if (isExternal(url)) return m;
    return `${prefix}${q}${url}?v=${version}${q2}`;
  });
  return content;
}

console.log(`Build concluído em dist/ (cache bust: v=${version})`);
