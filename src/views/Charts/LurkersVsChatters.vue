<template>
	<div class="lurkers-vs-chatters">
		<BarChart v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
	</div>
</template>

<script>
	import BarChart from '@/components/ChartTypes/BarChart.vue';
	import ChartFunc from '@/mixins/ChartFunc.vue';

	export default {
		components: {
			BarChart
		},
		mixins: [
			ChartFunc
		],
		data: () => ({
			legendLabels: ["Chatters", "Lurkers"],
			hasMultipleDataSets: true
		})
	}
</script>