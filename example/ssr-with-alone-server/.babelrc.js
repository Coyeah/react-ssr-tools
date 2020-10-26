module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage',
				modules: false,
				corejs: 3,
			},
		],
		'@babel/preset-react',
		'@babel/preset-typescript',
	],
	plugins: [
		[
			'@babel/plugin-proposal-decorators',
			{
				legacy: true,
			},
		],
		[
			'@babel/plugin-proposal-class-properties',
			{
				loose: true,
			},
		],
		[
			'@babel/plugin-transform-runtime',
			{
				corejs: 3,
			},
		],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-object-assign',
	]
};
