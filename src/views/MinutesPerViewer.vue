<template>
	<div class="minutes-per-viewer">
		<ChartHeader v-if="loaded" v-bind:view="view" @change="hideEmptyDaysEnabled = $event;" />
		<div class="bar-container">
			<BarChart v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Chart from '@/components/Chart/Chart.vue';
	import BarChart from '@/components/BarChart.vue';
	import ChartHeader from '@/components/Chart/ChartHeader/ChartHeader.vue';

	export default {
		name: 'MinutesPerViewer',
		extends: Chart,
		components: {
			BarChart,
			ChartHeader
		},
		data: () => ({
			view: "Minutes Per Viewer",
			legendLabels: ["Minutes per viewer"]
		})
	}
</script>