import { RenderFuncOptions } from './interface/render';
import { ServerJs } from './interface/config';
import { getVersion, reactToStream } from './utils';
import { useCdn } from './useCdn';

export const renderTemplate = async (ctx: RenderFuncOptions) => {
	const {config: {useCDN, template}, config} = ctx;
	const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local'; // 标志非正式环境
	const props = {
		config,
	};
	
	let TEMPLATE_PATH: ServerJs | string = template;
	
	if (useCDN && typeof template === 'string') {
		const version = getVersion(template);
		const filename = `template${version}`;
		TEMPLATE_PATH = await useCdn(template, isLocal, filename);
	}
	
	if (isLocal && typeof TEMPLATE_PATH === 'string') {
		delete require.cache[TEMPLATE_PATH];
	}
	
	const Template = typeof TEMPLATE_PATH === 'string'
		? require(TEMPLATE_PATH).default
		: TEMPLATE_PATH;
	const stream = reactToStream(Template, props, config);
	return stream;
};

export default renderTemplate;
