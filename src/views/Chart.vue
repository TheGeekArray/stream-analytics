<template>
	<div class="chart" v-if="loaded">
		<ChartHeader 
			v-bind:topics="topics"
			v-bind:displayAverage="displayAverage"  
			v-on:settings-updated="settings = $event;"
		/>
		<router-view v-bind:streamData="streamData" v-bind:labels="labels" v-bind:settings="settings" />
	</div>
	<div class="no-data-uploaded" v-else>
		<h2>No data has been uploaded yet</h2>
		<p> Upload some data with the uploader in the top right corner to get started.</p>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';
	import ChartHeader from '@/components/ChartHeader/ChartHeader.vue';

	export default {
		components: { ChartHeader },
		data: () => ({
			topics: ["Organic Viewers", "Artificial Viewers"],
			displayAverage: true,
			loaded: false,
			streamData: [],
			labels: [],
			settings: {
				general: {
					shouldHideEmptyDays: false,
					shouldHideTrendline: false
				},
				organicViewers: {
					shouldHideTotalAverage: false,
					shouldHideTotalOrganicAverage: false
				}
			}
		}),
		watch: {
			streamData: function() {
				if (Object.keys(this.streamData[0]).length > 0)  {
					this.loaded = true;

					if (this.settings.general.shouldHideEmptyDays) {
						this.hideEmptyDays();
					}
				}
			},
			// eslint-disable-next-line no-unused-vars
			$route: function(to, from) {
				this.topics = to.params.topics;
				this.displayAverage = to.params.displayAverage;
			}
		},
		created() {
			this.setupListeners();
			this.sendDataRequestedEvent();
		},
		destroyed() {
			ipcRenderer.removeListener("dataProcessed", this.sendDataRequestedEvent);
			ipcRenderer.removeListener("dataLoaded", this.setStreamData);
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataLoaded", this.setStreamData);
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.topics);
			},
			setStreamData: function(event, data, labels) {
				this.streamData = data;
				this.labels = labels;
			},
			hideEmptyDays: function() {
				let data = this.streamData;
				let labels = this.labels;

				let index = 0;
				while (index < data[0].length) {
					if (data[0][index] === 0) {
						data.forEach(dataSet => dataSet.splice(index, 1));
						labels.splice(index, 1);
					} else {
						++index;
					}
				}

				this.streamData = data;
				this.labels = labels;
			},
		}
	}
</script>

<style scoped>
	.no-data-uploaded {
		text-align: center;
		margin-top: 100px;
	}

	h2 {
		color: rgb(226, 226, 226);
	}

	p {
		font-size: 16px;
	}
</style>