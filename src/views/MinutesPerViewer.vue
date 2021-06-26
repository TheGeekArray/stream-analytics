<template>
	<div class="minutes-per-viewer">
		<ChartHeader v-if="loaded" v-bind:view="view" @change="hideEmptyDaysEnabled = $event;" />
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Chart from '@/components/Chart.vue';
	import Bar from '@/components/Bar.vue';
	import ChartHeader from '@/components/ChartHeader.vue';

	export default {
		name: 'MinutesPerViewer',
		extends: Chart,
		components: {
			Bar,
			ChartHeader
		},
		data: () => ({
			view: "Minutes Per Viewer",
			legendLabels: ["Minutes per viewer"]
		})
	}
</script>