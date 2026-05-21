// Fix absolute paths in Expo web export for GitHub Pages subdirectory deployment.
// Replaces /_expo -> /MegExam/_expo and /favicon.ico -> /MegExam/favicon.ico
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const basePath = '/MegExam';

let html = fs.readFileSync(indexPath, 'utf-8');

// Fix absolute asset paths to include base path
html = html.replace(/src="\/_expo\//g, `src="${basePath}/_expo/`);
html = html.replace(/href="\/_expo\//g, `href="${basePath}/_expo/`);
html = html.replace(/href="\/favicon\.ico"/g, `href="${basePath}/favicon.ico"`);

// Add base tag to handle any remaining relative paths
html = html.replace('<head>', `<head>\n  <base href="${basePath}/">`);

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Fixed base paths for GitHub Pages deployment.');
