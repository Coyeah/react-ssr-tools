import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';

export const Layout: React.FC = props => props.children ? (
	<div className='normal'>
		<h1 className='title'>
			<Link to='/'>Koa + React + SSR</Link>
			<div className='author'>by coyeah</div>
		</h1>
		{props.children}
	</div>
) : null;

export default Layout;
