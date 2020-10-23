const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const common = require('./webpack.common.js');
const paths = require('./paths');

const optimization = {
	sideEffects: false,
	runtimeChunk: true,
	minimize: true,
	minimizer: [
		new TerserPlugin({
			cache: true,
			parallel: true, // improvement: multiple-process
			sourceMap: true,
			terserOptions: {
				ecma: undefined,
				parse: {},
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
				mangle: true, // 混淆命名
				ie8: false, // 支持ie8?
				safari10: true, // fix 10 11 bugs
			},
		}),
		new OptimizeCSSAssetsPlugin({
			assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: 'cssnano',
			cssProcessorPluginOptions: {
				preset: [
					'advanced',
					{
						discardComments: {
							removeAll: true,
						},
						autoprefixer: true,
					},
				],
			},
		}),
	],
	splitChunks: {
		// automaticNameDelimiter: '~',
		chunks: 'all',
		minSize: 40000,
		cacheGroups: {
			vendor: {
				test: /[\\/]node_modules[\\/]/,
				name: 'vendor',
				chunks: 'initial',
				priority: 10,
				enforce: true,
				minChunks: 2,
			},
		},
	},
};

module.exports = merge(common, {
	mode: 'production',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		Page: paths.appIndex,
	},
	output: {
		publicPath: paths.PUBLIC_PATH,
		path: paths.appDist,
		pathinfo: true,
		filename: 'static/js/[name].js',
		chunkFilename: 'static/js/[name].chunk.js',
		hotUpdateChunkFilename: '[hash].hot-update.js',
		devtoolModuleFilenameTemplate: (info) =>
			path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
	},
	plugins: [
		new webpack.DefinePlugin({
			__isBrowser__: true,
		}),
		new LoadablePlugin({ filename: 'csr-stats.json' }),
	],
	optimization,
});
