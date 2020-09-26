import { FC as ReactFC } from 'react';

export interface FC extends ReactFC {
	getInitialProps?: (params: any) => Promise<any>;
	Layout?: ReactFC;
	preload?: () => Promise<Preload>;
}

interface Preload {
	default: ReactFC;
}
