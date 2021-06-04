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
					reader.onload = e => this.sendEvents(e);
					reader.readAsText(file);
				} catch (err) {
					console.log(err);
				}
			},
			sendEvents: function(event) {
				ipcRenderer.send("fileUploaded", event.target.result);
				this.$emit("load");
			}
		}
	};
</script>