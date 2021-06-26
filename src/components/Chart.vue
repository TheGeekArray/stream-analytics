<script>
	import { ipcRenderer } from 'electron';

	export default {
		name: "Chart",
		data: () => ({
			loaded: false,
			initialData: [],
			labels: {},
			chartdata: {},
			options: {},
			barKey: 0,
			hideEmptyDaysEnabled: false
		}),
		watch: {
			initialData: function() {
				this.updateData();
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
			ipcRenderer.removeListener("dataLoaded", this.setInitialData);
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataLoaded", this.setInitialData);
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view);
			},
			setInitialData: function(event, data, labels) {
				this.initialData = data;
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
				let data = this.initialData[0];
				
				let index = 0;
				while (index < data.length) {
					if (data[index] === 0) {
						for (let dataSet of this.initialData) {
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
						data: this.initialData[0],
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					}];

				if (this.initialData.length === 2) {
					datasets.push({
						label: this.legendLabels[1],
						backgroundColor: "#18181b",
						data: this.initialData[1]
					});
				}

				return {
					labels: this.labels,
					datasets: datasets
				}
			}
		}
	}
</script>
