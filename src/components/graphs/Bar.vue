<template>
	<AverageViewers v-if="label === 'Average Viewers'" v-bind:data="data" v-bind:options="options" v-bind:label="label"/>
	<BarBase v-else v-bind:data="data" v-bind:options="options" v-bind:label="label"/>
</template>

<script>
	import AverageViewers from '@/components/graphs/AverageViewers.vue';
	import BarBase from '@/components/graphs/mixins/BarBase.vue';

	export default {
		components: {
			AverageViewers,
			BarBase
		},
		props: {
			label: String,
			data: Object,
			options: Object
		}
	}
</script>