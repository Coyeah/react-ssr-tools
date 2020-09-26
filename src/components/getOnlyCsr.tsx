// 通过使用该HOC使得组件只在客户端进行渲染
import React, { PureComponent, ComponentType, FC } from 'react';

export function getOnlyCsr(WrappedComponent: FC): ComponentType {
	class OnlyCsrClass extends PureComponent<unknown, IState> {
		state = {
			isCsr: false,
		};
		
		public componentDidMount() {
			this.setState({ isCsr: true });
		}
		
		render() {
			return this.state.isCsr ? (
				<WrappedComponent {...this.props} />
			) : (
				<div />
			);
		}
	}
	
	for (const key in WrappedComponent) {
		// 静态属性传递
		// @ts-ignore for this issue https://github.com/Microsoft/TypeScript/issues/6480
		OnlyCsrClass[key] = WrappedComponent[key];
	}
	return OnlyCsrClass;
}

export default getOnlyCsr;

interface IState {
	isCsr: boolean;
}
