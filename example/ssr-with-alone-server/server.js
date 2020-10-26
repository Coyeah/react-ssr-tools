const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const mount = require('koa-mount');
const {join, extname} = require('path');
const {parseCookie, parseNavLang} = require('./serverHelper');

const {useCdn} = require('react-ssr-tools/lib/useCdn');
const axios = require('axios');

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
	const path = ctx.req.url;
	
	// 符合要求的路由才进行服务端渲染，否则走静态文件逻辑
	if (!ext) {
		ctx.type = 'text/html';
		ctx.status = 200;

		const render = await useCdn(' http://172.19.9.1:7012/render.ssr.js', true, 'render.ssr');
		const { html, error } = await render({path});
		
		ctx.body = html;
	} else {
		const response = await axios.get(`http://172.19.9.1:7012${path}`);
		
		ctx.body = response.data;
	}
});

// app.use(mount('/', require('koa-static')(join(__dirname, 'dist'))));

app.listen(7001, () => {
	console.log('\n');
	console.log('Server running at', 'http://localhost:7001');
	console.log('\n');
});
