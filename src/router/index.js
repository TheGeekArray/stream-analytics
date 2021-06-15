import Vue from 'vue';
import VueRouter from 'vue-router';
import AverageViewers from '../views/AverageViewers.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'AverageViewers',
		component: AverageViewers
	},
	{
		path: '/minutes-per-viewer',
		name: 'MinutesPerViewer',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "settings" */ '../views/MinutesPerViewer.vue')
	},
	{
		path: '/settings',
		name: 'Settings',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
	}
];

const router = new VueRouter({
	routes
});

export default router;
