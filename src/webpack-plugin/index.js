const nodePath = require('path');
const fs = require('fs');
const makeDir = require('make-dir');

class SsrPlugin {
	constructor({
		            filename = 'config.ssr.js',
		            outputAsset = true,
		            writeToDisk
	            }) {
		this.opts = {
			outputAsset,
			writeToDisk,
			filename,
		};
		
		// The Webpack compiler instance
		this.compiler = null;
	}
	
	apply(compiler) {
		this.compiler = compiler;
		if (this.opts.outputAsset || this.opts.writeToDisk) {
			compiler.hooks.emit.tapAsync('react-ssr-tools/webpack-plugin', this.handleEmit);
		}
	}
	
	handleEmit = (hookCompiler, callback) => {
	
	}
};

module.exports = SsrPlugin;
module.exports.default = SsrPlugin;
