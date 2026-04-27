const fs = require('fs');
const path = require('path');

function patchFile(filePath, transform) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[fix-cra] Skipped missing file: ${filePath}`);
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`[fix-cra] Patched ${path.relative(process.cwd(), filePath)}`);
  }
}

const appRoot = process.cwd();
const wdsConfigPath = path.join(
  appRoot,
  'node_modules',
  'react-scripts',
  'config',
  'webpackDevServer.config.js'
);
const requiredFilesPath = path.join(
  appRoot,
  'node_modules',
  'react-dev-utils',
  'checkRequiredFiles.js'
);

patchFile(wdsConfigPath, source => {
  if (source.includes('setupMiddlewares(middlewares, devServer)')) {
    return source;
  }

  const oldBlock = `    // \`proxy\` is run between \`before\` and \`after\` \`webpack-dev-server\` hooks
    proxy,
    onBeforeSetupMiddleware(devServer) {
      // Keep \`evalSourceMapMiddleware\`
      // middlewares before \`redirectServedPath\` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to \`PUBLIC_URL\` or \`homepage\` from \`package.json\` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },`;

  const newBlock = `    proxy,
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Keep \`evalSourceMapMiddleware\`
      // middlewares before \`redirectServedPath\` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }

      // Redirect to \`PUBLIC_URL\` or \`homepage\` from \`package.json\` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },`;

  return source.replace(oldBlock, newBlock);
});

patchFile(requiredFilesPath, source =>
  source.replace('fs.accessSync(filePath, fs.F_OK);', 'fs.accessSync(filePath, fs.constants.F_OK);')
);
