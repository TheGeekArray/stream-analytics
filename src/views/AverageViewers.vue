<template>
	<div class="average-viewers">
		<ChartHeader v-if="loaded" v-bind:view="view" @change="hideEmptyDaysEnabled = $event; updateData()" />
		<div class="bar-container" v-if="loaded">
			<Bar v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
			<div class="organic-range-average">
				<span class="range-average-label">Total Organic Average</span>
				<span class="range-average">{{rangeTotal}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import Chart from '@/components/Chart.vue';
	import Bar from '@/components/Bar.vue';
	import ChartHeader from '@/components/ChartHeader.vue';

	export default {
		name: 'AverageViewers',
		extends: Chart,
		components: {
			Bar,
			ChartHeader
		},
		data: () => ({
			view: "Organic Viewers",
			rangeTotal: "",
			legendLabels: ["Organic", "Hosts/raids/embeds"]
		}),
		watch: {
			initialData: function() {
				if (Object.keys(this.initialData[0]).length > 0)  {
					this.rangeTotal = this.getRangeTotal().toFixed(2);
					this.loaded = true;
				}
			}
		},
		methods: {
			getRangeTotal: function() {
				const organicData = this.initialData[0];
				const total = organicData.reduce((previousValue, currentValue) => previousValue + currentValue);

				return total / organicData.filter(value => value !== 0).length;
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
							ticks: {
								autoSkip: true,
								autoSkipPadding: 5
							}
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
	.bar-container {
		display: flex;
		flex-direction: column;
	}

	.organic-range-average {
		text-align: center;
		background: #18181b;
		width: 140px;
		height: 60px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 10px;
		align-self: flex-end;
		margin-top: -25px;
		border-radius: 3px;
	}

	.range-average-label {
		flex-basis: 100%;
		font-size: 13px;
	}

	.range-average {
		font-weight: 700;
		font-size: 22px;
		color: #885cca;
		flex-basis: 100%;
	}
</style>