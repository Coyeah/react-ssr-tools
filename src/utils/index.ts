import { resolve } from 'path';
import { Readable } from 'stream';
import { createElement, FunctionComponent } from 'react';
import {
	renderToNodeStream,
	renderToString as reactRenderToString,
} from 'react-dom/server';
import { Config } from '../interface/config';

export const getVersion = (str: string) => {
	try {
		const arr = /\d+(\.\d+)+/.exec(str);
		if (arr === null) {
			throw new Error(str);
		}
		return arr[0];
	} catch (e) {
		console.error('请检查 CDN 地址是否符合规范', str);
	}
};

export const resolveDir = (path: string) =>
	resolve(process.cwd(), path);

export const logGreen = (text: string) => {
	console.log(`\x1B[32m ${text}`);
};

export const reactToStream = (
	Component: FunctionComponent,
	props: object,
	config: Config,
) => {
	const { baseDir } = config;
	const BASE_DIR = baseDir || process.cwd();
	if (config.useReactToString) {
		return reactRenderToString(createElement(Component, props));
	} else {
		return renderToNodeStream(createElement(Component, props));
	}
};

export class ReadableString extends Readable {
	str: string;
	sent: boolean = false;
	
	constructor(str: string) {
		super();
		this.str = str;
	}
	
	_read() {
		if (!this.sent) {
			this.push(Buffer.from(this.str));
			this.sent = true;
		} else {
			this.push(null);
		}
	}
}
