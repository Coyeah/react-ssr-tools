import { ReactElement } from 'react';

export interface Global extends NodeJS.Global {
	renderToNodeStream: (element: ReactElement) => NodeJS.ReadableStream | string;
	isLocal: boolean;
	renderToString: (element: ReactElement) => string;
}
