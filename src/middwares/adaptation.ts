import { Middleware } from 'koa';
import { Config } from '../interface/config';
const { match } = require('path-to-regexp');
const mime = require('mime-types');

const queryString = (str: string)=>{
	let obj: { [name: string]: string } = {};
	str.replace(/([^?&=]+)=([^&]+)/g, (_, k: string, v: string) => (obj[k] = v));
	return obj;
}

export default (config: Config): Middleware => (ctx, next) => {
	const url = ctx?.request?.url;
	if (!url) return next();
	if (mime.lookup(url) !== false) return next();
	
	const { routes } = config;
	const params = queryString(url);
	const _url = url.replace(/\?.*/g, '');
	
	for (let i = 0; i < routes.length; i++) {
		const { path } = routes[i];
		const target = match(path)(_url);
		if (target) {
			ctx.params = {
				...ctx.params,
				...target.params,
				...params
			};
		}
	}
	return next();
};
