<script>
	import { Bar } from 'vue-chartjs';
	import 'chartjs-plugin-trendline';

	export default {
		extends: Bar,
		props: {
			data: Object,
			options: Object,
			label: String
		},
		mounted () {
			const chartdata = this.getChartData();

			this.renderChart(chartdata, this.options);
		},
		methods: {
			getChartData: function() {
				return {
					labels: this.data["Date"],
					datasets: [{
						label: this.label,
						backgroundColor: "#772ce8",
						data: this.data[this.label],
						trendlineLinear: {
							style: "rgba(141,141,141, .8)",
							lineStyle: "dotted|solid",
							width: 2
						}
					}]
				};
			}
		}
	}
</script>