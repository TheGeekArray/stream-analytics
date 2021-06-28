<template>
	<div class="organic-viewers">
		<div class="bar-container">
			<BarChart v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
			<div class="organic-range-average">
				<span class="range-average-label">Total Organic Average</span>
				<span class="range-average">{{rangeTotal}}</span>
			</div>
		</div>
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
			labels: Array
		},
		data: () => ({
			rangeTotal: "",
			legendLabels: ["Organic", "Hosts/raids/embeds"],
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
				this.rangeTotal = this.getRangeTotal().toFixed(2);

				this.chartdata = this.getChartData();
				this.barKey++;
			},
			getRangeTotal: function() {
				const organicData = this.streamData[0];
				const total = organicData.reduce((previousValue, currentValue) => previousValue + currentValue);

				return total / organicData.filter(value => value !== 0).length;
			},
			getChartData: function() {
				return {
					labels: this.labels,
					datasets: [{
						label: this.legendLabels[0],
						backgroundColor: "#772ce8",
						data: this.streamData[0],
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					},
					{
						label: this.legendLabels[1],
						backgroundColor: "#18181b",
						data: this.streamData[1]
					}]
				}
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
								for (let i = 0; i < tooltipItems.length; i++) {
									total += parseFloat(tooltipItems[i].yLabel);
								}
								return 'Total: ' + total.toFixed(2);
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

<style scoped>
	.bar-container {
		display: flex;
		flex-direction: column;
	}

	.organic-range-average {
		text-align: center;
		background: #18181b;
		width: 140px;
		height: 60px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 10px;
		align-self: flex-end;
		margin-top: -25px;
		border-radius: 3px;
	}

	.range-average-label {
		flex-basis: 100%;
		font-size: 13px;
	}

	.range-average {
		font-weight: 700;
		font-size: 22px;
		color: #885cca;
		flex-basis: 100%;
	}
</style>