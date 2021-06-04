<template>
	<label class="text-reader">
		<input type="file" @change="loadTextFromFile">
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