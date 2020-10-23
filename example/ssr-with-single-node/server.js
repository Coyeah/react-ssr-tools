const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const mount = require('koa-mount');
const {join, extname} = require('path');
const {parseCookie, parseNavLang} = require('./serverHelper');

const renderToStream = require('react-ssr-tools/lib/renderToStream').default;
const adaptation = require('react-ssr-tools/lib/middwares/adaptation');
const ssrConfig = require('./src/config.ssr');

const app = new Koa();
const router = new Router();

router.get('/api/getIndexData', (ctx, next) => {
	ctx.body = {
		news: [
			{
				id: '1',
				title: 'Racket v7.3 Release Notes',
			},
			{
				id: '2',
				title: 'Free Dropbox Accounts Now Only Sync to Three Devices',
			},
			{
				id: '3',
				title: 'Voynich Manuscript Decoded by Bristol Academic',
			},
			{
				id: '4',
				title:
					'Burger King to Deliver Whoppers to LA Drivers Stuck in Traffic',
			},
			{
				id: '5',
				title:
					'How much do YouTube celebrities charge to advertise your product? ',
			},
		],
	};
});

app.use(router.routes()).use(router.allowedMethods());

app.use(
	compress({
		threshold: 2048,
		flush: require('zlib').Z_SYNC_FLUSH,
	}),
);

app.use(adaptation(ssrConfig));

app.use(async (ctx, next) => {
	/**
	 *  扩展global对象
	 *
	 *  这里是在服务端处理好cookie，
	 *  会把所有cookie处理成{}形式
	 *  赋值到global上面，方便客户端使用
	 *
	 *  同时获取浏览器的默认语言，处理好
	 */
	global._cookies = parseCookie(ctx);
	global._navigatorLang = parseNavLang(ctx);
	
	const ext = extname(ctx.request.path);
	// 符合要求的路由才进行服务端渲染，否则走静态文件逻辑
	if (!ext) {
		// 这里默认是流失渲染
		ctx.type = 'text/html';
		ctx.status = 200;
		/* umi */
		// const { html, error } = await render({
		// 	path: ctx.request.url,
		// 	mode: 'stream',
		// });
		
		/* ssr */
		const stream = await renderToStream({
			path: ctx.req.url,
			config: ssrConfig,
			params: ctx.params,
		});
		
		ctx.body = stream;
	} else {
		await next();
	}
});

/**
 *  注意这里的静态目录设置，需要和umi打包出来的目录是同一个
 *  这里最好是用nginx配置静态目录，如果是用cdn方式部署，这里可以忽略
 *
 */
app.use(mount('/', require('koa-static')(join(__dirname, 'dist'))));

app.listen(7001, () => {
	console.log('\n');
	console.log('Server running at', 'http://localhost:7001');
	console.log('\n');
});

module.exports = app.callback();
