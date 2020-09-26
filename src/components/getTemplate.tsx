import React from 'react';
import serialize from 'serialize-javascript';
import { Config } from '../types/config';

const defaultComponent: React.FC = (props) => <>{props.children}</>;
const getCommonNode = (TargetComponent: React.FC): React.FC => (
	props,
) => (props.children ? <TargetComponent {...props} /> : null);

export const getTemplate = (
	__isBrowser__?: boolean,
	commonNode: React.FC = defaultComponent,
): React.FC<TemplateProps> => (props) => {
	if (__isBrowser__) return getCommonNode(commonNode)(props);
	else {
		const {
			serverData,
			app: {
				config: {injectCss, injectScript},
			},
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
			<div id="root">{getCommonNode(commonNode)(props)}</div>
			{serverData && (
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(
							serverData,
						)}`, // 使用pathname作为组件初始化数据的隔离，防止props污染
					}}
				/>
			)}
			<div
				dangerouslySetInnerHTML={{
					__html: injectScript && injectScript.join(''),
				}}
			/>
			</body>
			</html>
		);
	}
};

export default getTemplate;

export interface TemplateProps {
	templateData: {
		app: {
			config: Config;
		};
		serverData: any;
	};
	
	[name: string]: any;
}

