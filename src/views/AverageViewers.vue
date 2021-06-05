<template>
	<div class="home">
		<div class="header">
			<FileReader @load="updateBar"/>
			<Dropdown v-if="loaded" @change="updateData"/>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/Bar.vue';
	import FileReader from '@/components/FileReader.vue';
	import Dropdown from '@/components/Dropdown.vue';
	import { ipcRenderer } from 'electron';

	export default {
		name: 'Home',
		components: {
			Bar,
			FileReader,
			Dropdown
		},
		data: () => ({
			loaded: false,
			initialData: {},
			chartdata: {},
			options: {},
			barKey: 0,
			defaultTimeUnit: "Day"
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

				this.initialData = data;
				this.updateData(this.defaultTimeUnit);
				this.options = this.getOptions();

				this.loaded = true;
				this.updateBar();
			},
			updateData(timeUnit) {
				let updatedData = {};

				switch(timeUnit) {
				case "Day":
					updatedData = this.getAllData(this.initialData);
					this.chartdata = this.getChartData(updatedData);
					break;
				case "Week":
					return;
				case "Month":
					updatedData = this.groupDataInMonths(this.initialData);
					this.chartdata = this.getChartData(updatedData);
					break;
				case "Year":
					updatedData = this.groupDataInYears(this.initialData);
					this.chartdata = this.getChartData(updatedData);
					break;
				default:
					updatedData = this.getAllData(this.initialData);
					this.chartdata = this.getChartData(updatedData);
					break;
				}

				this.updateBar();
			},
			getAllData(data) {
				let allData = [];
				let labels = [];

				for (let year in data) {
					for (let month in data[year]) {
						for (let day in data[year][month]) {
							allData.push(data[year][month][day]);
							labels.push(data[year][month] + " " + data[year][month][day]);
						}
					}
				}

				return {data: allData, labels: labels };
			},
			groupDataInYears(data) {
				let groupedData = [];
				let labels = [];

				for (let year in data) {
					let yearDataTotal = 0;
					let divisor = 0;

					for (let month in data[year]) {
						for (let day in data[year][month]) {
							if (data[year][month][day] === "0") continue;
							yearDataTotal += parseFloat(data[year][month][day]);
							divisor++;
						}
					}

					groupedData.push(yearDataTotal / divisor);
					labels.push(year);
				}

				return { data: groupedData, labels: labels };
			},
			groupDataInMonths(data) {
				let groupedData = [];
				let labels = [];

				for (let year in data) {
					for (let month in data[year]) {
						let monthDataTotal = 0;
						let divisor = 0;

						for (let day in data[year][month]) {
							if (data[year][month][day] === "0") continue;
							monthDataTotal += parseFloat(data[year][month][day]);
							divisor++;
						}

						groupedData.push(monthDataTotal / divisor);
						labels.push(month);
					}
				}

				return { data: groupedData, labels: labels };
			},
			getChartData: function(data) {
				return {
					labels: data.labels,
					datasets: [{
						label: "Average Viewers",
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