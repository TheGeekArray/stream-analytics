<script>
	export default {
		props: {
			streamData: Array,
			labels: Array,
			settings: Object,
			topics: Array
		},
		data: () => ({
			chartdata: {},
			options: {},
			barKey: 0
		}),
		beforeMount() {
			this.options = this.getOptions(this.hasMultipleDataSets);
			this.updateData();
		},
		watch: {
			streamData: function() {
				this.updateData();
			}
		},
		methods: {
			updateData: function() {
				this.chartdata = this.getChartData();
				this.barKey++;
			},
			getChartData: function() {
				let data = {
					labels: this.labels,
					datasets: [{
						label: this.legendLabels[0],
						backgroundColor: "#772ce8",
						data: this.streamData[0],
						
					}]
				}

				if (this.streamData.length > 1) {
					data.datasets.push({
						label: this.legendLabels[1],
						backgroundColor: "#18181b",
						data: this.streamData[1]
					});
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
			getOptions: function(hasMultipleDataSets) {
				let options = {
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
							stacked: hasMultipleDataSets,
							ticks: {
								autoSkip: true,
								autoSkipPadding: 5
							}
						}],
						yAxes: [{
							stacked: hasMultipleDataSets,
							ticks: {
								min: 0
							}
						}]
					}
				};

				if (hasMultipleDataSets) {
					options.tooltips.callbacks.footer = this.getTooltipFooter();
				}

				return options;
			},
			getTooltipFooter: function() {
				return function(tooltipItems) {
					let total = 0;
					for (let i = 0; i < tooltipItems.length; i++) {
						total += parseFloat(tooltipItems[i].yLabel);
					}

					if (total % 1 === 0) {
						total = total.toFixed(0);
					} else {
						total = total.toFixed(2);
					}

					return 'Total: ' + total;
				}
			}
		}
	}
</script>
