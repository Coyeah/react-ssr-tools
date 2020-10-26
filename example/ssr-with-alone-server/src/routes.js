const routes = [
	{
		path: '/',
		exact: true,
		component: () => require('@/pages/index').default,
	},
	{
		path: '/news/:id',
		exact: true,
		component: () => require('@/pages/news').default,
	},
];

module.exports = routes;
