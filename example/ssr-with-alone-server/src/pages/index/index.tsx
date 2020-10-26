import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.less';

const Page: React.FC<{ news: any[] }> = (props) => {
	return (
		<div className="normal">
			<div className="welcome"/>
			<ul className="list">
				{props.news &&
				props.news.map((item) => (
					<li key={item.id}>
						<div>文章标题: {item.title}</div>
						<div className="toDetail">
							<Link to={`/news/${item.id}`}>点击查看详情</Link>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export const getInitialProps = async (ctx: any) => {
	const {data} = await axios.get(
		'http://localhost:7001/api/getIndexData',
	);
	return data;
	// ssr渲染模式只在服务端通过Node获取数据，csr渲染模式只在客户端通过http请求获取数据，getInitialProps方法在整个页面生命周期只会执行一次
	// return __isBrowser__ ? (await window.fetch('/api/getIndexData')).json() : ctx.service.api.index()
};

Page.getInitialProps = getInitialProps;

export default Page;
