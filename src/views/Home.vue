<template>
	<div class="home">
		<div class="header">
			<FileReader @load="buildChart"/>
			<Dropdown v-if="loaded" @change="updateCurrentLabel" v-bind:labels="labels" :key="dropdownKey"/>
		</div>
		<div class="bar-container">
			<Bar v-if="loaded" v-bind:data="chartdata" v-bind:label="currentLabel" :key="barKey"/>
		</div>
	</div>
</template>

<script>
	import Bar from '@/components/graphs/Bar.vue';
	import FileReader from '@/components/FileReader.vue';
	import Dropdown from '@/components/Dropdown.vue';
	const { ipcRenderer } = require('electron');

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
			labels: [],
			currentLabel: "Average Viewers",
			barKey: 0,
			dropdownKey: 0
		}),
		beforeMount () {
			let component = this;
			ipcRenderer.send("dataRequested");
			ipcRenderer.on("dataLoaded", function(event, data) {
				component.setData(data);
				component.setAllLabels(data);
				component.setLoaded();
			});

			this.barKey++;
		},
		methods: {
			updateCurrentLabel: function(event) {
				this.currentLabel = event;
				this.barKey++;
			},
			buildChart: async function(data) {
				let component = this;

				ipcRenderer.send("fileUploaded", data);

				ipcRenderer.on("dataProcessed", function(event, processedData) {
					component.setData(processedData);
					component.setAllLabels(processedData);
					component.setLoaded();
				});

				this.barKey++;
			},
			setData: function(data) {
				this.chartdata = data;
			},
			setAllLabels: function(data) {
				this.labels = Object.keys(data).filter(topic => topic !== "Date");
			},
			setLoaded: function() {
				this.loaded = true;
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