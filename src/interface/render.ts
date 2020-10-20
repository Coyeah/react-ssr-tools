import { Config } from './config';

export type RenderFuncOptions = {
	config: Config;
	
	path: string;
	initialData?: object;
	htmlTemplate?: string;
	mountElementId?: string;
	context?: object;
	origin?: string;

	[name: string]: any;
}
