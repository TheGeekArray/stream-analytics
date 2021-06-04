<template>
	<div class="home">
		<div class="header">
			<FileReader @load="updateBar"/>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/Bar.vue';
	import FileReader from '@/components/FileReader.vue';
	import { ipcRenderer } from 'electron';

	export default {
		name: 'Home',
		components: {
			Bar,
			FileReader
		},
		data: () => ({
			loaded: false,
			chartdata: {},
			options: {},
			barKey: 0
		}),
		beforeMount () {
			this.setupListeners();
			this.sendDataRequestedEvent();
		},
		destroyed () {
			ipcRenderer.removeListener("dataProcessed", this.sendDataRequestedEvent);
			ipcRenderer.removeListener("dataLoaded", this.processData);
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
				ipcRenderer.on("dataLoaded", this.processData);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", "Average Viewers");
			},
			updateBar: function() {
				this.barKey++;
			},
			processData: function(event, data) {
				if (Object.keys(data).length === 0 && data.constructor === Object) return;

				this.chartdata = this.getData(data);
				this.options = this.getOptions();

				this.loaded = true;
				this.updateBar();
			},
			getData: function(data) {
				return {
					labels: Object.keys(data),
					datasets: [{
						label: "Average Viewers",
						backgroundColor: "#772ce8",
						data: Object.values(data),
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
							footer: function(tooltipItems, data) {
								if (data.datasets[0].label !== "Organic") return null;

								let total = 0;
								for (let i = 0; i < tooltipItems.length; i++) {
									total += parseFloat(tooltipItems[i].yLabel);
								}
								return 'Total: ' + total;
							}
						}
					},
					scales: {
						xAxes: [{
							stacked: true,
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

<style>
	.home {
		width: 100%;
		margin-top: 50px;
	}

	.header {
		display: flex;
		justify-content: space-between;
	}
</style>