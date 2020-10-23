const nodePath = require('path');
const fs = require('fs');
const makeDir = require('make-dir');

class SsrConfigPlugin {
	constructor({
		            filename = 'stats.json',
		            writeToDisk,
		            outputAsset = true,
		            path,
		            type,
	            } = {}) {
		this.opts = {filename, writeToDisk, outputAsset, path, type};
		// The Webpack compiler instance
		this.compiler = null;
	}
	
	apply(compiler) {
		this.compiler = compiler;
		
		// if (typeof this.opts.type !== 'string') return
		
		// Check if webpack version 4 or 5
		if ('jsonpFunction' in compiler.options.output) {
			// Add a custom output.jsonpFunction: __REACT_SSR_TOOLS_CHUNKS__
			compiler.options.output.jsonpFunction = '__REACT_SSR_TOOLS_CHUNKS__'
		} else {
			// Add a custom output.chunkLoadingGlobal: __LOADABLE_LOADED_CHUNKS__
			compiler.options.output.chunkLoadingGlobal = '__REACT_SSR_TOOLS_CHUNKS__'
		}
		
		if (this.opts.outputAsset || this.opts.writeToDisk) {
			compiler.hooks.emit.tapAsync('react-ssr-tools/webpack-plugin', this.handleEmit)
		}
	}
	handleEmit = (hookCompiler, callback) => {
		const stats = hookCompiler.getStats().toJson({
			hash: true,
			publicPath: true,
			assets: true,
			chunks: false,
			modules: false,
			source: false,
			errorDetails: false,
			timings: false,
		})
		const result = JSON.stringify(stats, null, 2)
		
		if (this.opts.outputAsset) {
			hookCompiler.assets[this.opts.filename] = {
				source() {
					return result
				},
				size() {
					return result.length
				},
			}
		}
		
		if (this.opts.writeToDisk) {
			this.writeAssetsFile(result)
		}
		
		callback()
	}
	
	writeAssetsFile = manifest => {
		const outputFolder =
			this.opts.writeToDisk.filename || this.compiler.options.output.path;
		
		const outputFile = nodePath.resolve(outputFolder, this.opts.filename)
		
		try {
			if (!fs.existsSync(outputFolder)) {
				makeDir.sync(outputFolder);
			}
		} catch (err) {
			if (err.code !== 'EEXIST') {
				throw err;
			}
		}
		
		fs.writeFileSync(outputFile, manifest);
	}
	
};

module.exports = SsrConfigPlugin;
module.exports.default = SsrConfigPlugin;
