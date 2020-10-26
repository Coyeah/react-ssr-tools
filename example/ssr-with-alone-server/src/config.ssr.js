module.exports = {
	type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
	injectCss: [`/static/css/Page.chunk.css`], // 客户端需要加载的静态样式表
	injectScript: [
		`<script src='/static/js/runtime~Page.js'></script>`,
		`<script src='/static/js/vendors~Page.chunk.js'></script>`,
		`<script src='/static/js/Page.chunk.js'></script>`,
	], // 客户端需要加载的静态资源文件表
	useCDN: false,
	useReactToString: true,
};
