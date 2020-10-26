import { Context } from 'koa';
import { renderToString, renderToNodeStream as renderToNodeStreamReact } from 'react-dom/server';
import renderTemplate from './renderTemplate';
import { useCdn } from './useCdn';
import { getVersion, ReadableString } from './utils';
import { RenderFuncOptions } from './interface/render';
import { Global } from './interface/global';

const mergeStream = require('merge-stream');

declare const global: Global;

export const renderToStream = async (ctx: RenderFuncOptions, timelyRequire: boolean = true) => {
	const {context, config} = ctx;
	
	let csr = false;
	if (!!context) {
		// 兼容express和koa的query获取
		csr = (context as Context).request?.query?.csr
			? (context as Context).request.query.csr
			: false;
	}
	
	if (config.type !== 'ssr' || csr) {
		const stream = await renderTemplate(ctx);
		const doctypeStream = new ReadableString('<!DOCTYPE html>');
		return mergeStream(doctypeStream, stream);
	}
	
	const {useCDN, serverJs, baseDir, useReactToString} = config;
	const BASE_DIR = baseDir || process.cwd();
	const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local'; // 标志非正式环境
	let SERVER_JS = serverJs;
	
	if (useCDN && typeof serverJs === 'string') {
		const version = getVersion(serverJs);
		const filename = `serverBundle${version}`;
		SERVER_JS = await useCdn(serverJs, isLocal, filename);
	}
	
	if (isLocal && typeof SERVER_JS === 'string') {
		// 本地开发环境下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
		delete require.cache[SERVER_JS];
	}
	
	if (!global.renderToNodeStream) {
		if (useReactToString) {
			timelyRequire
				? global.renderToNodeStream = require(BASE_DIR +
				'/node_modules/react-dom/server').renderToString
				: global.renderToNodeStream = renderToString;
		} else {
			timelyRequire
				? global.renderToNodeStream = require(BASE_DIR +
				'/node_modules/react-dom/server').renderToNodeStream
				: global.renderToNodeStream = renderToNodeStreamReact;
		}
	}
	
	const serverComponent =
		typeof SERVER_JS === 'string'
			? await require(SERVER_JS).default(ctx)
			: await SERVER_JS(ctx);
	const stream = global.renderToNodeStream(serverComponent);
	if (useReactToString) {
		return '<!DOCTYPE html>' + stream;
	} else {
		const doctypeStream = new ReadableString('<!DOCTYPE html>');
		return mergeStream(doctypeStream, stream);
	}
};

export default renderToStream;
