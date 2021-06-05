<template>
	<div class="home">
		<div class="header">
			<FileReader class="file-reader-component"/>
			<div class="data-display-options">
				<EmptyDaysOption v-if="loaded" @change="hideEmptyDays = $event; updateData();" class="empty-days-option-component"/>
				<TimeUnitPicker v-if="loaded" @change="timeUnit = $event; updateData();" class="time-unit-picker-component"/>
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
			timeUnit: "Day"
		}),
		created() {
			this.setView("Average Viewers");
		},
		beforeMount() {
			this.options = this.getOptions();
		},
		watch: {
			initialData: function() {
				this.updateData();
				
				if (Object.keys(this.initialData).length !== 0) {
					this.loaded = true;
				}
			}
		},
		methods: {
			updateData() {
				let organicViewersData = this.retrieveGroupedData(this.timeUnit, this.initialData.organicViewers);
				let artificialViewersData = this.retrieveGroupedData(this.timeUnit, this.initialData.artificialViewers);

				this.chartdata = this.getChartData(organicViewersData, artificialViewersData);
				this.barKey++;
			},
			getChartData: function(organicViewersData, artificialViewersData) {
				return {
					labels: organicViewersData.labels,
					datasets: [{
						label: "Organic Viewers",
						backgroundColor: "#772ce8",
						data: organicViewersData.data,
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					},
					{
						label: "Artificial Viewers",
						backgroundColor: "#18181b",
						data: artificialViewersData.data
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