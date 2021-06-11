<template>
	<div class="date-picker">
		<input type="date" id="start-date" :max="range.end || today" v-model="range.start" @change="changeRange();">
		<input type="date" id="end-date" :min="range.start" :max="today" v-model="range.end" @change="changeRange();">
	</div>
</template>

<script>
import moment from 'moment';

export default {
	name: "DatePicker",
	data: function() {
		return {
			today: moment().format('YYYY-MM-DD'),
			range: {
				start: "",
				end: ""
			}
		}
	},
	methods: {
		changeRange() {
			if (!this.range.start || !this.range.end) {
				return;
			}
			this.$emit("change", this.range);
		}
	}
}
</script>


<style scoped>
	.date-picker {
		display: flex;
	}
</style>