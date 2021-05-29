<template>
	<div class="home">
		<div class="header">
			<FileReader @load="buildChart"/>
			<Dropdown v-if="loaded" @change="updateLabel" v-bind:labels="allLabels" :key="dropdownKey"/>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:label="label" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/graphs/Bar.vue';
	import FileReader from '@/components/FileReader.vue';
	import Dropdown from '@/components/Dropdown.vue';

	export default {
		name: 'Home',
		components: {
			Bar,
			FileReader,
			Dropdown
		},
		data: () => ({
			loaded: false,
			chartdata: {},
			allLabels: [],
			label: "Average Viewers",
			barKey: 0,
			dropdownKey: 0
		}),
		methods: {
			updateLabel: function(event) {
				this.label = event;
				this.barKey++;
			},
			buildChart: function(data) {
				this.parseData(data);

				if (this.chartdata) {
					this.allLabels = this.getAllLabels();
				}

				this.barKey++;
				this.loaded = true;
			},
			parseData: function(data) {
				const splittedData = this.splitData(data);

				this.chartdata = this.mapData(splittedData);
			},
			splitData: function(data) {
				const dataToSplit = data.split("\n");
				const splittedData = [];

				for (let line of dataToSplit) {
					let splittedLine = line.split(",");
					splittedData.push(splittedLine);
				}

				return splittedData;
			},
			mapData: function(data) {
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
			},
			getAllLabels: function() {
				return Object.keys(this.chartdata).filter(topic => topic !== "Date");
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