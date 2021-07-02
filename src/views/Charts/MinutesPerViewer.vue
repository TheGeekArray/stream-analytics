<template>
	<div class="minutes-per-viewer">
		<BarChart v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
	</div>
</template>

<script>
	import BarChart from '@/components/ChartTypes/BarChart.vue';

	export default {
		components: {
			BarChart
		},
		props: {
			streamData: Array,
			labels: Array,
			settings: Object
		},
		data: () => ({
			legendLabels: ["Minutes per viewer"],
			chartdata: {},
			options: {},
			barKey: 0
		}),
		beforeMount() {
			this.options = this.getOptions();
		},
		mounted() {
			this.updateData();
		},
		watch: {
			streamData: function() {
				this.updateData();
			}
		},
		methods: {
			updateData() {
				this.chartdata = this.getChartData();
				this.barKey++;
			},
			getChartData: function() {
				let data = {
					labels: this.labels,
					datasets: [{
						label: this.legendLabels[0],
						backgroundColor: "#772ce8",
						data: this.streamData[0]
					}]
				}

				if (!this.settings.general.shouldHideTrendline) {
					data.datasets[0].trendlineLinear = {
						style: "rgba(141,141,141, .8)",
						lineStyle: "dotted|solid",
						width: 2
					}
				}

				return data;
			},
			getOptions: function() {
				return {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						position: "bottom",
						align: "end",
						labels: {
							boxWidth: 13,
							padding: 30,
							fontSize: 13
						}
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