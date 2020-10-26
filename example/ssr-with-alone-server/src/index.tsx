import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter,
	Route,
	Switch,
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import {
	getWrappedComponent,
	getServerRender,
} from 'react-ssr-tools';
import Store from '@/store';
import Layout from '@/layout';
import routes from '@/routes';

const clientRender = async () => {
	const store =
		window['store'] ||
		new Store({
			initialState: window['__INITIAL_DATA__'],
		});
	window['store'] = store;
	
	// 客户端渲染 | hydrate
	ReactDOM[window['__USE_SSR__'] ? 'hydrate' : 'render'](
		(
			<Provider store={store}>
				<BrowserRouter>
					<Layout>
						<Switch>
							{
								// 使用高阶组件getWrappedComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
								routes.map(({ path, exact, component }) => {
									const ActiveComponent = component();
									// if (ActiveComponent.preload) {
									// 	ActiveComponent.preload = ActiveComponent.load;
									// }
									const WrappedComponent = getWrappedComponent(
										ActiveComponent,
									);
									return (
										<Route
											exact={exact}
											key={path}
											path={path}
											render={() => <WrappedComponent />}
										/>
									);
								})
							}
						</Switch>
					</Layout>
				</BrowserRouter>
			</Provider>
		),
		document.getElementById('root')
	);
	
	if (process.env.NODE_ENV === 'development' && module.hot) {
		module.hot.accept();
	}
};

const serverRender = async (ctx: any) => {
	const store = new Store({});
	const WrappedComponent: React.FC = (props) => (
		<Provider store={store}>
			<Layout>{props.children}</Layout>
		</Provider>
	);
	return await getServerRender({
		routes,
		WrappedComponent,
	})(ctx);
};

export default __isBrowser__ ? clientRender() : serverRender;
