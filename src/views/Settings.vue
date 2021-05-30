<template>
	<div class="settings">
		<h1>Settings</h1>

		<div class="date">
			<label>When did you start streaming?</label>
			<input type="date" class="date-picker" v-model="date" @change="setDateSetting">
		</div>
	</div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
	data: () => ({ date: "" }),
	methods: {
		setDateSetting(event) {
			ipcRenderer.send("startingDateSet", event.target.value);
			ipcRenderer.on("settingsUpdated", function() {
				console.log("Settings updated.");
			});
		}
	}
}
</script>


<style scoped>
	h1 {
		margin-bottom: 50px;
	}

	label {
		margin-bottom: 10px;
		display: block;
	}
</style>