import { Context } from 'koa';
import { Config } from './interface/config';
import { getVersion, reactToStream } from './utils';
import { useCdn } from './useCdn';

export const renderTemplate = async (ctx: Context, config: Config) => {
	const {useCDN, template} = config;
	const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local'; // 标志非正式环境
	const props = {
		templateData: ctx,
		ctx
	};
	let TEMPLATE_PATH = template;
	
	if (useCDN && typeof template === 'string') {
		const version = getVersion(template);
		const filename = `template${version}`;
		TEMPLATE_PATH = await useCdn(template, isLocal, filename);
	}
	
	if (isLocal && typeof TEMPLATE_PATH === 'string') {
		delete require.cache[TEMPLATE_PATH];
	}
	
	if (!!TEMPLATE_PATH) {
		TEMPLATE_PATH = require('./components/getTemplate').Template;
	}
	
	const Template =
		typeof TEMPLATE_PATH === 'string'
			? require(TEMPLATE_PATH).default
			: TEMPLATE_PATH;
	const stream = reactToStream(Template, props, config);
	return stream;
}

export default renderTemplate;
