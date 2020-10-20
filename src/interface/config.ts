import { RouteItem } from './route';
import { RenderFuncOptions } from './render';

export interface Config {
	env?: string;
	type?: 'ssr' | 'csr';
	routes: Array<RouteItem>;
	injectCss: Array<string>;
	injectScript: Array<string>;
	baseDir?: string;
	serverJs: ServerJs | string;
	template: ServerJs | string;
	useCDN?: boolean;
	useReactToString?: boolean;
}

export interface ServerJs {
	(ctx: RenderFuncOptions): Promise<React.ReactElement>;
}
