<template>
	<div class="home">
		<div class="header">
			<FileReader @load="parseData"/>
			<Dropdown v-if="loaded" @change="updateLabel" v-bind:labels="allLabels" :key="dropdownKey"/>
		</div>
		<div class="bar-container">
			<AverageViewers v-if="label === 'Average Viewers' && loaded" v-bind:data="chartdata" v-bind:options="options" v-bind:label="label" :key="barKey"/>
			<BarBase v-if="label !== 'Average Viewers'  && loaded" v-bind:data="chartdata" v-bind:options="options" v-bind:label="label" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import BarBase from '@/components/graphs/mixins/BarBase.vue';
	import FileReader from '@/components/FileReader.vue';
	import Dropdown from '@/components/Dropdown.vue';
	import AverageViewers from '@/components/graphs/AverageViewers.vue';

	export default {
		name: 'Home',
		components: {
			BarBase,
			FileReader,
			Dropdown,
			AverageViewers
		},
		data: () => ({ 
			loaded: false, 
			data: [],
			options: {},
			chartdata: {},
			allLabels: [],
			label: "Average Viewers", 
			barKey: 0,
			dropdownKey: 0
		}),
		methods: {
			updateLabel: function (event) {
				this.label = event;
				this.barKey++;
			},
			parseData: function(data) {
				const splittedData = this.splitData(data);

				this.chartdata = this.mapData(splittedData);
				this.allLabels = Object.keys(this.chartdata).filter(topic => topic !== "Date");
				this.options = {
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

				this.barKey++;
				this.loaded = true;
			},
			splitData: function (data) {
				const dataToSplit = data.split("\n");
				const splittedData = [];

				for (let line of dataToSplit) {
					let splittedLine = line.split(",");
					splittedData.push(splittedLine);
				}

				return splittedData;
			},
			mapData: function (data) {
				const topics = data.shift();
				const twitchData = {};

				let count = 0;
				for (let topic of topics) {
					twitchData[topic] = [];

					for (let line of data) {
						twitchData[topic].push(line[count]);
					}

					count++;
				}

				return twitchData;
			}
		}
	}
</script>

<style>
	.home {
		width: 90%;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
	}
</style>