import React from 'react';
import {
	StaticRouter,
} from 'react-router-dom';
import { Context } from 'koa';
import getComponent from './getComponent';
import getTemplate, { TemplateProps } from './components/getTemplate';
import { EmptyComponent } from './utils/components';
import { RouteItem } from './interface/route';

const Template = getTemplate();

const getServerRender = (options: Partial<RenderOptions>): ServerRender => async (ctx: Context) => {
	const {
		routes = [],
		WrappedComponent = EmptyComponent,
	} = options;
	
	// 服务端渲染 根据ctx.path获取请求的具体组件，调用getInitialProps并渲染
	const ActiveComponent = getComponent(routes, ctx.path)();
	const serverData = ActiveComponent.getInitialProps
		? await ActiveComponent.getInitialProps(ctx)
		: {};
	ctx.serverData = serverData;
	// @ts-ignore
	const templateData = ctx as TemplateProps['templateData'];
	return (
		<WrappedComponent>
			<StaticRouter location={ctx.req.url} context={serverData}>
				<Template templateData={templateData}>
					<ActiveComponent {...serverData}/>
				</Template>
			</StaticRouter>
		</WrappedComponent>
	)
}

export default getServerRender;

export type ServerRender = (ctx: Context) => Promise<JSX.Element>;

export interface RenderOptions {
	routes: RouteItem[];
	WrappedComponent: React.FC<any>;
	store?: any;
}
