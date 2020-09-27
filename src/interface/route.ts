import { RouteProps } from 'react-router-dom';
import { FC } from './fc';

export interface RouteItem extends Omit<RouteProps, 'component'> {
	path: string;
	component: () => FC;
}
