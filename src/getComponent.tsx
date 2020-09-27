import React from 'react';
import { matchPath, RouteProps } from 'react-router-dom';
import { FC } from './interface/fc';
import { RouteItem } from './interface/route';

const NotFound: FC = () => <div>路由查询404</div>

const getComponent = (routes: RouteItem[], path: string): (() => FC) => {
	// 根据请求的path来匹配到对应的component
	const activeRoute = routes.find(route => matchPath(path, route as unknown as RouteProps)); // 找不到对应的组件时返回NotFound组件
	const activeComponet = activeRoute && activeRoute.component || (() => NotFound);
	return activeComponet;
};

export default getComponent;
