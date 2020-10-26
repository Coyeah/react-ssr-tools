import { renderToString } from 'react-dom/server';
import { match } from 'path-to-regexp';

import { getRender } from 'react-ssr-tools';

import routes from './routes';
import config from './config.ssr';
import entry from './index';
import template from './template';

const render = async (obj) => {
	return getRender({
		...config,
		routes,
		serverJs: entry,
		template,
	})(obj);
}

export default render;

function queryString(str) {
	let obj = {}
	str.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (obj[k] = v));
	return obj;
};
