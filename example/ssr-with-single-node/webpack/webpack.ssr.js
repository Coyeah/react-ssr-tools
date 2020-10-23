const webpack = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
	entry: {
		page: paths.appIndex,
		template: paths.resolveApp('./src/template'),
		config: paths.resolveApp('./src/config.ssr.js'),
	},
	devtool: 'cheap-module-eval-source-map',
	target: 'node',
	mode: 'production',
	externals: nodeExternals({
	  allowlist: /\.(css|less|sass|scss)$/,
	}),
	output: {
		path: paths.appDist,
		publicPath: '/',
		filename: '[name].ssr.js',
		libraryTarget: 'commonjs2',
	},
	plugins: [
		new webpack.DefinePlugin({
			__isBrowser__: false,
		}),
		new LoadablePlugin({ filename: 'ssr-stats.json' })
	],
});
