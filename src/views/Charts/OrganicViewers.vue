<template>
	<div class="organic-viewers">
		<div class="bar-container">
			<BarChart v-bind:data="chartdata" v-bind:options="options" :key="barKey"/>
			<div class="range-averages">
				<div v-show="!settings.organicViewers.shouldHideTotalAverage" class="total-range-average">
					<span class="range-average-label">Total Average</span>
					<span class="range-average">{{rangeTotal}}</span>
				</div>
				<div v-show="!settings.organicViewers.shouldHideTotalOrganicAverage" class="total-range-average">
					<span class="range-average-label">Total Organic Average</span>
					<span class="range-average">{{rangeOrganicTotal}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BarChart from '@/components/ChartTypes/BarChart.vue';
	import ChartFunc from '@/mixins/ChartFunc.vue';

	export default {
		components: {
			BarChart
		},
		mixins: [
			ChartFunc
		],
		data: () => ({
			rangeTotal: "",
			rangeOrganicTotal: "",
			legendLabels: ["Organic", "Hosts/raids/embeds"]
		}),
		mounted() {
			if (this.streamData.length > 1) {
				this.updateRangeTotals();
			}
		},
		updated() {
			this.updateRangeTotals();
		},
		methods: {
			updateRangeTotals() {
				this.rangeTotal = this.getRangeTotal(this.streamData[0].map((item, index) => item + this.streamData[1][index])).toFixed(2);
				this.rangeOrganicTotal = this.getRangeTotal(this.streamData[0]).toFixed(2);
			},
			getRangeTotal: function(data) {
				const total = data.reduce((previousValue, currentValue) => previousValue + currentValue);

				return total / data.filter(value => value !== 0).length;
			},
		}
	}
</script>

<style scoped>
	.bar-container {
		display: flex;
		flex-direction: column;
	}

	.range-averages {
		display: flex;
		align-self: flex-start;
	}

	.total-range-average {
		text-align: center;
		background: #18181b;
		width: 140px;
		height: 60px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 10px;
		margin-top: -25px;
		border-radius: 3px;
		margin-right: 10px;
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