<template>
	<div class="home">
		<div class="header">
			<FileReader class="file-reader-component"/>
			<div class="data-display-options">
				<EmptyDaysOption v-if="loaded && showEmptyDaysOption" v-bind:isChecked="hideEmptyDays" @change="hideEmptyDays = $event; updateData();" class="empty-days-option-component"/>
				<TimeUnitPicker 
					v-if="loaded"
					@change="timeUnit = $event; updateData(); showEmptyDaysOption = $event === 'Day' || $event === 'Week'"
					class="time-unit-picker-component"
				/>
			</div>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/Bar.vue';
	import FileReader from '@/components/FileReader.vue';
	import TimeUnitPicker from '@/components/TimeUnitPicker.vue';
	import DataProcesser from '@/components/DataProcesser.vue';
	import EmptyDaysOption from '@/components/EmptyDaysOption.vue';

	export default {
		name: 'AverageViewers',
		components: {
			Bar,
			FileReader,
			TimeUnitPicker,
			EmptyDaysOption
		},
		mixins: [DataProcesser],
		data: () => ({
			loaded: false,
			chartdata: {},
			options: {},
			barKey: 0,
			timeUnit: "Day",
			showEmptyDaysOption: true,
			hideEmptyDays: false
		}),
		created() {
			this.setView("Organic Viewers");
		},
		beforeMount() {
			this.options = this.getOptions();
		},
		watch: {
			initialData: function() {
				this.updateData();
				
				if (Object.keys(this.initialData).length > 0)  {
					this.loaded = true;
				}
			}
		},
		methods: {
			updateData() {
				let organicViewersData = this.retrieveGroupedData(this.timeUnit, this.initialData);

				if (this.hideEmptyDays) {
					let data = organicViewersData.data.organic;
					
					let index = 0;
					while (index < data.length) {
						if (data[index] === 0) {
							organicViewersData.data.organic.splice(index, 1);
							organicViewersData.data.artificial.splice(index, 1);
							organicViewersData.labels.splice(index, 1);
						} else {
							++index;
						}
					}
				}

				this.chartdata = this.getChartData(organicViewersData);
				this.barKey++;
			},
			getChartData: function(organicViewersData) {
				return {
					labels: organicViewersData.labels,
					datasets: [{
						label: "Organic Viewers",
						backgroundColor: "#772ce8",
						data: organicViewersData.data.organic,
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					},
					{
						label: "Artificial Viewers",
						backgroundColor: "#18181b",
						data: organicViewersData.data.artificial
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
								if (data.datasets[0].label !== "Organic Viewers") return null;

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
		justify-content: space-between;
	}

	.data-display-options {
		display: flex;
	}

	.time-unit-picker-component {
		margin-left: 30px;
	}
</style>