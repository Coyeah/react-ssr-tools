const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) =>
	path.resolve(appDirectory, relativePath);

module.exports = {
	resolveApp,
	PUBLIC_PATH: '/',
	appRoot: resolveApp('.'),
	appSrc: resolveApp('src'),
	appIndex: resolveApp('src/index'),
	appDist: resolveApp('dist'),
	appNodeModules: resolveApp('node_modules'),
	appPublic: resolveApp('public'),
};
