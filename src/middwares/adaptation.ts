import { Middleware } from 'koa';
import { Config } from '../interface/config';
const { match } = require('path-to-regexp');


export default (config: Config): Middleware => (ctx, next) => {
	// @ts-ignore
	ctx.app.config = config;
	
	const { routes } = config;
	const {
		request: { url },
	} = ctx;
	
	for (let i = 0; i < routes.length; i++) {
		const { path } = routes[i];
		const target = match(path)(url);
		if (target) {
			ctx.params = {
				...ctx.params,
				...target.params
			};
		}
	}
	
	return next();
};
