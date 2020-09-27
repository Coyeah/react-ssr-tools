import React, { PureComponent, ComponentClass } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { FC } from '../interface/fc';

let _this: any = null;
let routerChanged = false;

const popStateFn = (e: PopStateEvent) => {
	// historyPop的时候需要调用getInitialProps
	routerChanged = true;
};

function getInitialProps(WrappedComponent: FC): ComponentClass {
	class GetInitialPropsClass extends PureComponent<RouteComponentProps, IState> {
		state = {
			extraProps: {},
		};
		
		constructor(props: RouteComponentProps) {
			super(props);
			if (!routerChanged) {
				routerChanged =
					!window.__USE_SSR__ ||
					(props.history && props.history.action === 'PUSH');
			}
			if (window.__USE_SSR__) {
				_this = this; // 修正_this指向，保证_this指向当前渲染的页面组件
				window.addEventListener('popstate', popStateFn);
			}
		}
		
		async componentDidMount() {
			// csr 或者 history push的时候需要调用getInitialProps
			if (
				(this.props.history && this.props.history.action !== 'POP') ||
				!window.__USE_SSR__
			) {
				await this.getInitialProps();
			}
		}
		
		async getInitialProps() {
			// csr首次进入页面以及csr/ssr切换路由时才调用getInitialProps
			const {props} = this;
			if (WrappedComponent.preload) {
				// react-loadable 情况
				WrappedComponent = (await WrappedComponent.preload()).default;
			}
			const extraProps = WrappedComponent.getInitialProps
				? await WrappedComponent.getInitialProps(props)
				: {};
			this.setState({extraProps});
		}
		
		render() {
			// 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
			const restProps = Object.assign(
				{},
				this.props,
				routerChanged ? {} : window.__INITIAL_DATA__ || {},
				this.state.extraProps,
			);
			return (
				<WrappedComponent {...restProps} />
			);
		}
	}
	return withRouter(GetInitialPropsClass);
}

export default getInitialProps;

interface IState {
	extraProps: object;
}

declare global {
	interface Window {
		__USE_SSR__: boolean;
		__INITIAL_DATA__: any;
	}
}
