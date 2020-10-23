import React from 'react';
import { StaticRouter } from 'react-router-dom';
import getComponent from './getComponent';
import getTemplate from '../components/getTemplate';
import { EmptyComponent } from '../utils/components';
import { RouteItem } from '../interface/route';
import { RenderFuncOptions } from '../interface/render';

export const GlobalTemplate = getTemplate();

export const getServerRender = (options: Partial<RenderOptions>): ServerRender => async (ctx) => {
	const {
		routes = [],
		WrappedComponent = EmptyComponent
	} = options;
	
	// 服务端渲染 根据ctx.path获取请求的具体组件，调用getInitialProps并渲染
	const ActiveComponent = getComponent(routes, ctx.path)();
	let serverData = ActiveComponent.getInitialProps
		? await ActiveComponent.getInitialProps(ctx)
		: {};
	serverData = {
		...serverData,
		...ctx.initialData || {}
	};
	
	return (
		<StaticRouter location={ctx.initialData} context={serverData}>
			<GlobalTemplate config={ctx.config} serverData={serverData}>
				<WrappedComponent>
					<ActiveComponent {...serverData}/>
				</WrappedComponent>
			</GlobalTemplate>
		</StaticRouter>
	)
};

export default getServerRender;

export type ServerRender = (ctx: RenderFuncOptions) => Promise<JSX.Element>;

export interface RenderOptions {
	routes: RouteItem[];
	WrappedComponent: React.FC<any>;
}
