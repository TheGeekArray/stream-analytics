<script>
	import BarBase from './mixins/BarBase.vue';

	export default {
		mixins: [ BarBase ],
		methods: {
			getChartData: function() {
				const organicAverage = this.calculateOrganicAverage(this.data["Average Viewers"], this.data["Hosts and Raids Viewers (%)"]);
				const artificialAverage = this.calculateArticifialAverage(this.data["Average Viewers"], organicAverage);

				return {
					labels: this.data["Date"],
					datasets: [{
						label: "Organic",
						backgroundColor: "#772ce8",
						data: organicAverage
					},
					{
						label: "Artificial",
						backgroundColor: "#18181b",
						data: artificialAverage
					}]
				};
			},
			calculateOrganicAverage: function(averageViewers, hostsAndRaids) {
				const organicAverage = [];

				for (let i = 0; i < averageViewers.length; i++) {
					let average = (1 - (hostsAndRaids[i] / 100)) * averageViewers[i];
					organicAverage.push(average);
				}

				return organicAverage;
			},
			calculateArticifialAverage: function(averageViewers, organicAverage) {
				const artificialAverage = [];

				for (let i = 0; i < averageViewers.length; i++) {
					let average = averageViewers[i] - organicAverage[i];
					artificialAverage.push(average);
				}

				return artificialAverage;
			}
		}
	}
</script>