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
		}),
		watch: {
			initialData: function() {		
				if (Object.keys(this.initialData[0]).length > 0)  {
					this.loaded = true;
				}
			}
		},
		methods: {
			getOptions: function() {
				return {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						position: "bottom"
					},
					tooltips: {
						mode: "x",
						callbacks: {
							label: function(tooltipItem, data) {
								var label = data.datasets[tooltipItem.datasetIndex].label || '';

								if (label) {
									label += ': ';
								}

								label += (tooltipItem.yLabel % 1 !== 0 ? tooltipItem.yLabel.toFixed(2) : tooltipItem.yLabel);
								return label;
							}
						}
					},
					scales: {
						xAxes: [{
							ticks: {
								autoSkip: true,
								autoSkipPadding: 5
							}
						}],
						yAxes: [{
							ticks: {
								min: 0
							}
							
						}]
					}
				};
			}
		}
	}
</script>