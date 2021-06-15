<template>
	<div class="minutes-per-viewer">
		<div class="header">
			<DatePicker v-if="loaded" @change="dateRange = $event; sendDataRequestedEvent();" />
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
		name: 'MinutesPerViewer',
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
				
				if (Object.keys(this.initialData.data).length > 0)  {
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
				ipcRenderer.send("dataRequested", this.timeUnit, this.dateRange, "Minutes Per Viewer");
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

<style scoped>
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