<script>
	import { ipcRenderer } from 'electron';

	export default {
		name: "Chart",
		data: () => ({
			loaded: false,
			streamData: [],
			labels: {},
			chartdata: {},
			options: {},
			barKey: 0,
			hideEmptyDaysEnabled: false
		}),
		watch: {
			streamData: function() {		
				this.updateData();

				if (Object.keys(this.streamData[0]).length > 0)  {
					this.loaded = true;
				}
			}
		},
		created() {
			this.setupListeners();
		},
		beforeMount() {
			this.options = this.getOptions();
			this.sendDataRequestedEvent();
		},
		destroyed() {
			ipcRenderer.removeListener("dataProcessed", this.sendDataRequestedEvent);
			ipcRenderer.removeListener("dataLoaded", this.setStreamData);
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataLoaded", this.setStreamData);
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view);
			},
			setStreamData: function(event, data, labels) {
				this.streamData = data;
				this.labels = labels;
			},
			updateData() {
				if (this.hideEmptyDaysEnabled) {
					this.hideEmptyDays();
				}

				this.chartdata = this.getChartData();
				this.barKey++;
			},
			hideEmptyDays: function() {
				let data = this.streamData[0];
				
				let index = 0;
				while (index < data.length) {
					if (data[index] === 0) {
						for (let dataSet of this.streamData) {
							dataSet.splice(index, 1);
						}
						this.labels.splice(index, 1);
					} else {
						++index;
					}
				}
			},
			getChartData: function() {
				let datasets = 
					[{
						label: this.legendLabels[0],
						backgroundColor: "#772ce8",
						data: this.streamData[0],
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					}];

				if (this.streamData.length === 2) {
					datasets.push({
						label: this.legendLabels[1],
						backgroundColor: "#18181b",
						data: this.streamData[1]
					});
				}

				return {
					labels: this.labels,
					datasets: datasets
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
