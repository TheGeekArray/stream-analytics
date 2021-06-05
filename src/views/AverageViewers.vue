<template>
	<div class="home">
		<div class="header">
			<FileReader @load="updateData"/>
			<Dropdown v-if="loaded" @change="timeUnit = $event; updateData();"/>
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
	import DataProcesser from '@/components/DataProcesser.vue';

	export default {
		name: 'Home',
		components: {
			Bar,
			FileReader,
			Dropdown
		},
		mixins: [DataProcesser],
		data: () => ({
			loaded: false,
			chartdata: {},
			options: {},
			barKey: 0,
			timeUnit: "Day"
		}),
		beforeMount() {
			this.options = this.getOptions();
		},
		watch: {
			initialData: function() {
				this.updateData();
				this.loaded = true;
			}
		},
		methods: {
			updateData() {
				let groupedData = this.retrieveGroupedData(this.timeUnit, this.initialData);
				this.chartdata = this.getChartData(groupedData);

				this.barKey++;
			},
			getChartData: function(data) {
				return {
					labels: data.labels,
					datasets: [{
						label: this.view,
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