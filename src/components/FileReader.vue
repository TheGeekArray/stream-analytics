<template>
	<label class="text-reader">
		Upload .csv file
		<input type="file" accept=".csv" @change="loadTextFromFile" style="display: none">
	</label>
</template>

<script>
	import { ipcRenderer } from 'electron';

	export default {
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

	input {
		display: none;
	}
</style>