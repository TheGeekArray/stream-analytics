<template>
	<div class="lurkers-vs-chatters">
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
			shouldHideTrendline: Boolean
		},
		data: () => ({
			legendLabels: ["Chatters", "Lurkers"],
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
					},
					{
						label: this.legendLabels[1],
						backgroundColor: "#18181b",
						data: this.streamData[1]
					}]
				}

				if (!this.shouldHideTrendline) {
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
							},
							title: function(tooltipItems, data) {
								return data.labels[tooltipItems[0].index];
							},
							footer: function(tooltipItems) {
								let total = 0;
								if (tooltipItems[1].yLabel === 0) {
									return 'Total unique viewers: 0';
								}

								for (let i = 0; i < tooltipItems.length; i++) {
									total += parseFloat(tooltipItems[i].yLabel);
								}
								
								return 'Total unique viewers: ' + total;
							}
						}
					},
					scales: {
						xAxes: [{
							stacked: true,
							ticks: {
								autoSkip: true,
								autoSkipPadding: 5
							}
						}],
						yAxes: [{
							stacked: true
						}]
					}
				};
			}
		}
	}
</script>