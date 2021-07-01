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
				name: 'OrganicViewers',
				component: OrganicViewers,
				props: true
			},
			{
				path: 'minutes-per-viewer',
				name: 'MinutesPerViewer',
				component: MinutesPerViewer,
				props: true
			},
			{
				path: 'lurkers-vs-chatters',
				name: 'LurkersVsChatters',
				component: LurkersVsChatters,
				props: true
			}
		]
	}
];

const router = new VueRouter({
	routes
});

export default router;
