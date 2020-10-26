const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const paths = require('./paths');
const regexp = require('./regexp');
const getStyleLoader = require('./getStyleLoader');

const OPEN_SOURCE_MAP = true;
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	context: paths.appRoot,
	module: {
		strictExportPresence: true,
		rules: [{
			oneOf: [{
				test: regexp.REGEXP_IMAGE,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			}, {
				test: regexp.REGEXP_SCRIPT,
				exclude: paths.appNodeModules,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						},
					},
				],
			}, {
				test: regexp.REGEXP_TYPESCRIPT,
				exclude: paths.appNodeModules,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						},
					},
				],
			}, {
				test: regexp.REGEXP_CSS,
				exclude: regexp.REGEXP_CSS_MODULE,
				use: getStyleLoader({
					isProd,
					sourceMap: OPEN_SOURCE_MAP,
					modules: false,
				}),
				sideEffects: true,
			},
				{
					test: regexp.REGEXP_CSS_MODULE,
					exclude: paths.appNodeModules,
					use: getStyleLoader({
						isProd,
						sourceMap: OPEN_SOURCE_MAP,
						modules: true,
					}),
					sideEffects: true,
				}, {
					test: regexp.REGEXP_LESS,
					use: getStyleLoader({
						isProd,
						sourceMap: OPEN_SOURCE_MAP,
						modules: false,
						useLess: true,
					}),
					sideEffects: true,
				}]
		}, {
			exclude: [
				/\.(js|jsx)$/,
				/\.(ts|tsx)$/,
				/\.(html|ejs)$/,
				/\.(css|less)$/,
				/\.json$/,
			],
			include: paths.appSrc,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: 'static/media/[name].[hash:8].[ext]',
					},
				},
			],
		}]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].css',
			chunkFilename: 'static/css/[name].chunk.css',
		}),
		new ProgressBarPlugin(),
		new FriendlyErrorsWebpackPlugin(),
	],
	resolve: {
		alias: {
			'@': paths.appSrc,
		},
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
	}
};
