<template>
	<div class="chart" v-if="loaded">
		<ChartHeader 
			v-bind:topics="topics"
			v-bind:displayAverage="displayAverage"  
			v-on:settings-updated="settings = $event;"
			v-on:timeunit-updated="timeUnit = $event;"
		/>
		<router-view v-bind:streamData="streamData" v-bind:labels="labels" v-bind:settings="settings" v-bind:timeUnit="timeUnit" />
	</div>
	<div class="no-data-uploaded" v-else>
		<h2>No data has been uploaded yet</h2>
		<p> Upload some data with the uploader in the top right corner to get started.</p>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';
	import ChartHeader from '@/components/ChartHeader/ChartHeader.vue';
	import Settings from '@/mixins/Settings.vue';

	export default {
		components: { 
			ChartHeader 
		},
		mixins: [
			Settings
		],
		data: () => ({
			topics: [],
			displayAverage: true,
			loaded: false,
			streamData: [],
			labels: [],
			timeUnit: "Day"
		}),
		created() {
			this.topics = this.getTopics(this.$route);
			this.setupListeners();
			this.sendDataRequestedEvent();
		},
		destroyed() {
			ipcRenderer.removeListener("dataProcessed", this.sendDataRequestedEvent);
			ipcRenderer.removeListener("dataLoaded", this.setStreamData);
		},
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
				this.topics = this.getTopics(to);
				this.displayAverage = to.params.displayAverage;
			}
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
			getTopics: function(route) {
				switch (route.name) {
					case "OrganicViewers":
					return ["Organic Viewers", "Artificial Viewers"];
					case "MinutesPerViewer":
					return ["Minutes Per Viewer"];
					case "LurkersVsChatters":
					return ["Chatters", "Lurkers"];
				}
			}
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