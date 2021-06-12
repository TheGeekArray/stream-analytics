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
	}

	input {
		background: #3f3f3f;
		border: none;
		box-shadow: none;
		color: #fff;
		padding: 8px 10px;
		font-family: Avenir, Helvetica, Arial, sans-serif;
		border-radius: 3px;
		text-align: center;
		font-size: 14px;
	}
	input::-webkit-datetime-edit-month-field,
	input::-webkit-datetime-edit-day-field,
	input::-webkit-datetime-edit-year-field {
		color: #fff;
	}

	input:hover {
		background: #2b2a2a;
	}

	input:focus,
	input:active {
		outline: none;
	}

	input::-webkit-calendar-picker-indicator {
		filter: invert(1);
	}

	#start-date {
		margin-right: 20px;
	}
</style>