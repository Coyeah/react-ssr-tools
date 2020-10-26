import getInitialProps from './components/getInitialProps';
import getTemplate from './components/getTemplate';
import getOnlyCsr from './components/getOnlyCsr';

/* 组件级别 */
export {
	getInitialProps,
	getInitialProps as getWrappedComponent,
	getTemplate,
	getOnlyCsr,
}

import getComponent from './modules/getComponent';
import getServerRender from './modules/getServerRender';
import getRender from './modules/getRender';

/* 模块级别 */
export {
	getComponent,
	getServerRender,
	getRender,
}
