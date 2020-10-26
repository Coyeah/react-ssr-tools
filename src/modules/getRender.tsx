import { match } from 'path-to-regexp';
import { renderToString } from 'react-dom/server';
import { Config } from '../interface/config';

export const getRender = (config: Config): RenderType => {
	const {
		routes,
		serverJs,
	} = config;
	
	return async (opts) => {
		let {path, params} = opts;
		let html, error;
		
		if (typeof path !== 'string') {
			error = new Error('path must be a string!');
		} else {
			const {params: _p} = traverseRoutes(routes, opts);
			params = {
				...params,
				..._p
			}
			
			try {
				html = renderToString(await (serverJs as Function)({config, path, params}, false))
			} catch (e) {
				error = e;
			}
		}
		
		return {
			html,
			error
		};
	}
}

export default getRender;

function traverseRoutes(routes: Config['routes'], opts: RenderOptions) {
	let {path: url, params} = opts;
	
	for (let i = 0; i < routes.length; i++) {
		const {path} = routes[i];
		const target = match(path)(url);
		
		if (target) {
			params = {
				...params,
				...target.params,
			};
		}
	}
	return {params};
}

export interface GetRenderOptions {
	config: Config;
}

export type RenderType = (opts: RenderOptions) => Promise<RenderReturn>;

export interface RenderOptions {
	path: string;
	params?: object;
}

export interface RenderReturn {
	html?: string;
	error?: Error;
}
