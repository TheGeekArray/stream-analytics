<template>
	<div class="file-reader">
		<label class="text-reader">
			Upload .csv file
			<input type="file" accept=".csv" @change="loadTextFromFile" style="display: none">
		</label>
		<font-awesome-icon icon="question-circle" class="file-reader-tooltip" v-on:mouseover="tooltipHovered = true" v-on:mouseleave="tooltipHovered = false" />
		<div v-show="tooltipHovered" class="file-reader-tooltip-container">
			<p>
				To get your stream analytics data, go to the Channel Analytics tab in the Creator Dashboard on Twitch.
				There, choose the range of data you want to import, keep the display on "Day", and click "Export".
			</p>
			<p>
				If you want to add new data, simply repeat the step above. It will get added to the existing data.
			</p>
		</div>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';

	export default {
		data: () => ({ 
			tooltipHovered: false
		}),
		methods: {
			loadTextFromFile(ev) {
				const file = ev.target.files[0];
				
				try {
					const reader = new FileReader();
					reader.onload = e => ipcRenderer.send("fileUploaded", e.target.result);
					reader.readAsText(file);
				} catch (err) {
					console.log(err);
				}
			}
		}
	};
</script>

<style scoped>
	.file-reader {
		position: relative;
	}

	.text-reader {
		background:  #3f3f3f;
		border-radius: 3px;
		display: inline-block;
		padding: 10px 15px;
		cursor: pointer;
		color: #fff;
	}

	.text-reader:hover {
		background: #2b2a2a;
	}

	.file-reader-tooltip {
		margin-left: 10px;
	}

	.file-reader-tooltip-container {
		position: absolute;
		background-color: rgb(26, 26, 26);
		z-index: 3;
		top: 25px;
		right: 0;
		border-radius: 3px;
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
		font-size: 12px;
		line-height: 1.5;
		padding: 0 20px;
		width: 200px;
	}

	input {
		display: none;
	}
</style>