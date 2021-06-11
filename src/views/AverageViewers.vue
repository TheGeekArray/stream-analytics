<template>
	<div class="home">
		<div class="header">
			<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
			<EmptyDaysOption 
				v-if="loaded"
				v-bind:isChecked="hideEmptyDaysEnabled"
				v-bind:timeUnit="timeUnit"
				@change="hideEmptyDaysEnabled = $event; sendDataRequestedEvent();"
				class="empty-days-option-component"
			/>
			<TimeUnitPicker 
				v-if="loaded"
				@change="timeUnit = $event; sendDataRequestedEvent();"
				class="time-unit-picker-component"
			/>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/Bar.vue';
	import TimeUnitPicker from '@/components/TimeUnitPicker.vue';
	import EmptyDaysOption from '@/components/EmptyDaysOption.vue';
	import DatePicker from '@/components/DatePicker.vue';
	import { ipcRenderer } from 'electron';

	export default {
		name: 'AverageViewers',
		components: {
			Bar,
			TimeUnitPicker,
			EmptyDaysOption,
			DatePicker
		},
		data: () => ({
			loaded: false,
			initialData: {},
			chartdata: {},
			options: {},
			barKey: 0,
			timeUnit: "Day",
			hideEmptyDaysEnabled: false,
			dateRange: {
				start: "",
				end: ""
			}
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
				
				if (Object.keys(this.initialData.data["organic"]).length > 0)  {
					this.loaded = true;
				}
			}
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
				ipcRenderer.on("dataLoaded", this.setInitialData);
				ipcRenderer.on("rangedDataLoaded", this.setInitialData);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.timeUnit, this.dateRange, "Organic Viewers");
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
				let data = this.initialData.data.organic;
				
				let index = 0;
				while (index < data.length) {
					if (data[index] === 0) {
						this.initialData.data["organic"].splice(index, 1);
						this.initialData.data["artificial"].splice(index, 1);
						this.initialData.labels.splice(index, 1);
					} else {
						++index;
					}
				}
			},
			getChartData: function(organicViewersData) {
				return {
					labels: organicViewersData.labels,
					datasets: [{
						label: "Organic",
						backgroundColor: "#772ce8",
						data: organicViewersData.data.organic,
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					},
					{
						label: "Hosts/raids/embeds",
						backgroundColor: "#18181b",
						data: organicViewersData.data.artificial
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
	.home {
		width: 100%;
		margin-top: 50px;
	}

	.header {
		display: flex;
		height: 60px;
		align-items: center;
	}

	.empty-days-option-component {
		margin-left: auto;
	}

	.time-unit-picker-component {
		justify-self: flex-end;
		margin-left: 20px;
	}
</style>