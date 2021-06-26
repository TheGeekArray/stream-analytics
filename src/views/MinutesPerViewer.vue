<template>
	<div class="minutes-per-viewer">
		<ChartHeader v-if="loaded" v-bind:view="view" @change="hideEmptyDaysEnabled = $event;" />
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/Bar.vue';
	import ChartHeader from '@/components/ChartHeader.vue';
	import { ipcRenderer } from 'electron';

	export default {
		name: 'MinutesPerViewer',
		components: {
			Bar,
			ChartHeader
		},
		data: () => ({
			view: "Minutes Per Viewer",
			loaded: false,
			initialData: {},
			chartdata: {},
			options: {},
			barKey: 0,
			hideEmptyDaysEnabled: false
		}),
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
		watch: {
			initialData: function() {
				this.updateData();
				
				if (Object.keys(this.initialData.data).length > 0)  {
					this.loaded = true;
				}
			}
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
				ipcRenderer.on("dataLoaded", this.setInitialData);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view);
			},
			setInitialData: function(event, data) {
				this.initialData = data;
			},
			updateData() {
				if (this.hideEmptyDaysEnabled) {
					this.hideEmptyDays();
				}

				this.chartdata = this.getChartData(this.initialData);
				this.barKey++;
			},
			hideEmptyDays: function() {
				let data = this.initialData.data;
				
				let index = 0;
				while (index < data.length) {
					if (data[index] === 0) {
						this.initialData.data.splice(index, 1);
						this.initialData.labels.splice(index, 1);
					} else {
						++index;
					}
				}
			},
			getChartData: function(data) {
				return {
					labels: data.labels,
					datasets: [{
						label: "Minutes per viewer",
						backgroundColor: "#772ce8",
						data: data.data,
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
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