import React, { ReactComponentElement } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, StaticRouter } from 'react-router-dom';
import getTemplate, { defaultComponent } from './components/getTemplate';
import getInitialProps from './components/getInitialProps';
import getComponent from './getComponent';
import { FC } from './interface/fc';
import { RouteItem } from './interface/route';

const defaultRouteRender: RenderOptions['routeRender'] = route => {
	const {component, ...restProps} = route;
	const ActiveComponent = component();
	const Layout = ActiveComponent.Layout || defaultComponent;
	const WrappedComponent = getInitialProps(ActiveComponent);
	return (
		<Route
			{...restProps}
			render={() => (
				<Layout key={window.location.pathname}>
					<WrappedComponent/>
				</Layout>
			)}
		/>
	)
}

export const defaultClientRender: ClientRenderType = (options) => {
	const {
		WrappedComponent,
		routes,
		id,
		routeRender
	} = options;
	ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
		(
			<WrappedComponent>
				<BrowserRouter>
					<Switch>
						{routes.map(routeRender)}
					</Switch>
				</BrowserRouter>
			</WrappedComponent>
		),
		document.getElementById(id)
	);
	
	// @ts-ignore
	if (process.env.NODE_ENV === 'development' && module.hot) {
		// @ts-ignore
		module.hot.accept();
	}
}

const getServerRender = (options: RenderOptions, isBrowser: boolean): ServerRenderType => async (ctx) => {
	const {
		WrappedComponent,
		routes,
	} = options;

	const ActiveComponent: FC = getComponent(routes, ctx.path)();
	let Layout: React.FC<any> = ActiveComponent.Layout || defaultComponent;
	Layout = getTemplate(isBrowser, Layout);
	const serverData = ActiveComponent.getInitialProps
		? await ActiveComponent.getInitialProps(ctx)
		: {};
	ctx.serverData = serverData;

	return (
		<WrappedComponent>
			<StaticRouter location={ctx.req.url} context={serverData}>
				<Layout templateData={ctx}>
					<ActiveComponent {...serverData}/>
				</Layout>
			</StaticRouter>
		</WrappedComponent>
	)
}

const getIndex = (options: Partial<IndexOptions>) => {
	const {
		isBrowser = false,
		clientRender = defaultClientRender,
		serverRender,
		routes = [],
		WrappedComponent = defaultComponent,
		routeRender = defaultRouteRender,
		id = 'root',
	} = options;
	
	const renderOptions: RenderOptions = {
		routes,
		WrappedComponent,
		routeRender,
		id
	};
	
	const _serverRender: IndexOptions['serverRender'] = serverRender || getServerRender(renderOptions, isBrowser);
	
	return isBrowser ? clientRender(renderOptions) : _serverRender;
}

export default getIndex;

export type ServerRenderType = (ctx: any) => Promise<JSX.Element>;

export type ClientRenderType = (o: RenderOptions) => void;

export type IndexOptions = {
	isBrowser: boolean;
	clientRender: ClientRenderType;
	serverRender: ServerRenderType;
} & RenderOptions;

export interface RenderOptions {
	routes: RouteItem[];
	WrappedComponent: React.FC;
	routeRender: (route: RouteItem) => ReactComponentElement<any>;
	id: string;
}
