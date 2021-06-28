import Vue from 'vue';
import VueRouter from 'vue-router';
import OrganicViewers from '../views/Charts/OrganicViewers.vue';
import MinutesPerViewer from '../views/Charts/MinutesPerViewer.vue';
import LurkersVsChatters from '../views/Charts/LurkersVsChatters.vue';
import Chart from '../views/Chart.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: Chart,
		children: [
			{
				path: '',
				redirect: 'organic-viewers'
			},
			{
				path: 'organic-viewers',
				name: 'Organic Viewers',
				component: OrganicViewers,
				props: true
			},
			{
				path: 'minutes-per-viewer',
				name: 'Minutes Per Viewer',
				component: MinutesPerViewer
			},
			{
				path: 'lurkers-vs-chatters',
				name: 'Lurkers vs. Chatters',
				component: LurkersVsChatters
			}
		]
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
