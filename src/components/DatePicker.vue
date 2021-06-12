<template>
	<div class="date-picker">
		<input type="date" id="start-date" :max="range.end || today" v-model="range.start" @change="$emit('change', range);">
		<input type="date" id="end-date" :min="range.start" :max="today" v-model="range.end" @change="$emit('change', range);">
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
				start: moment().subtract("30","days").format('YYYY-MM-DD'),
				end: moment().format('YYYY-MM-DD')
			}
		}
	}
}
</script>


<style scoped>
	.date-picker {
		display: flex;
		height: 25px;
	}

	#start-date {
		margin-right: 20px;
	}
</style>