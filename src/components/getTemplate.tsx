import React from 'react';
import serialize from 'serialize-javascript';
import { Config } from '../interface/config';

const getTemplate = (): React.FC<TemplateProps> => (props) => {
	const {
		serverData = {},
		app: {
			config: {
				injectScript, injectCss
			} = {}
		}
	} = props.templateData;
	
	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8"/>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, shrink-to-fit=no"
			/>
			<meta name="theme-color" content="#000000"/>
			<title>React App</title>
			{injectCss &&
			injectCss.map((item) => (
				<link rel="stylesheet" href={item} key={item}/>
			))}
		</head>
		<body>
		<div id="root">{props.children}</div>
		{serverData && (
			<script
				dangerouslySetInnerHTML={{
					// 使用pathname作为组件初始化数据的隔离，防止props污染
					__html: `window.__USE_SSR__=true; window.__INITIAL_DATA__=${serialize(serverData)}`,
				}}
			/>
		)}
		{injectScript && (
			<div
				dangerouslySetInnerHTML={{
					__html: injectScript && injectScript.join(''),
				}}
			/>
		)}
		</body>
		</html>
	)
};

export default getTemplate;

export interface TemplateProps {
	templateData: {
		app: {
			config: Config;
		};
		serverData: any;
	}
}

