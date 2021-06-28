<template>
	<div class="chart" v-if="loaded">
		<ChartHeader v-bind:view="view" @change="shouldHideEmptyDays = $event;" />
		<router-view v-bind:streamData="streamData" v-bind:labels="labels" />
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';
	import ChartHeader from '@/components/Chart/ChartHeader.vue';

	export default {
		components: { ChartHeader },
		name: "Chart",
		data: () => ({
			view: "Organic Viewers",
			loaded: false,
			streamData: [],
			labels: [],
			shouldHideEmptyDays: false
		}),
		watch: {
			streamData: function() {
				if (Object.keys(this.streamData[0]).length > 0)  {
					this.loaded = true;

					if (this.shouldHideEmptyDays) {
						this.hideEmptyDays();
					}
				}
			},
			// eslint-disable-next-line no-unused-vars
			$route: function(to, from) {
				this.view = to.name;
			}
		},
		created() {
			this.setupListeners();
		},
		beforeMount() {
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
				ipcRenderer.send("dataRequested", this.view);
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
