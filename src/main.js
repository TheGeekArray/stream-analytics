import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faReply, faCaretDown, faCaretUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(faCog);
library.add(faReply);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faBars);
library.add(faTimes);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.directive('clickoutside', {
	inserted: (el, binding, vnode) => {
		// assign event to the element
		el.clickOutsideEvent = function (event) {
		// here we check if the click event is outside the element and it's children
			if (!(el == event.target || el.contains(event.target))) {
				// if clicked outside, call the provided method
				vnode.context[binding.expression](event)
			}
		}
		// register click events
		document.body.addEventListener('click', el.clickOutsideEvent);
	},
	unbind: function (el) {
		// unregister click events before the element is unmounted
		document.body.removeEventListener('click', el.clickOutsideEvent);
	},
	stopProp(event) {
		event.stopPropagation()
	},
});

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
