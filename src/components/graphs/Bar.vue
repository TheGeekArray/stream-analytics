<template>
	<AverageViewers v-if="label === 'Average Viewers'" v-bind:data="data" v-bind:options="options" v-bind:label="label"/>
	<BarBase v-else v-bind:data="data" v-bind:options="options" v-bind:label="label"/>
</template>

<script>
	import AverageViewers from '@/components/graphs/AverageViewers.vue';
	import BarBase from '@/components/graphs/mixins/BarBase.vue';

	export default {
		components: {
			AverageViewers,
			BarBase
		},
		props: {
			label: String,
			data: Object
		},
		data: () => ({ options: {} }),
		beforeMount () {
			this.options = this.getOptions();
		},
		methods: {
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