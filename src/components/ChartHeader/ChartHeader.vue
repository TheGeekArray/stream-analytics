<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
		<button v-on:click="resetChart">Reset to 30 days</button>
		<EmptyDaysOption 
			v-bind:isChecked="hideEmptyDaysEnabled"
			v-bind:timeUnit="timeUnit"
			@change="hideEmptyDaysEnabled = $event; $emit('change', $event); sendDataRequestedEvent()"
			class="empty-days-option-component"
		/>
		<TimeUnitPicker 
			@change="timeUnit = $event; sendDataRequestedEvent();"
			class="time-unit-picker-component"
		/>
	</div>
</template>

<script>
	import DatePicker from '@/components/ChartHeader/SubComponents/DatePicker';
	import EmptyDaysOption from '@/components/ChartHeader/SubComponents/EmptyDaysOption';
	import TimeUnitPicker from '@/components/ChartHeader/SubComponents/TimeUnitPicker';
	import { ipcRenderer } from 'electron';
	import moment from 'moment';

	export default {
		name: 'ChartHeader',
		components: {
			DatePicker,
			EmptyDaysOption,
			TimeUnitPicker
		},
		props: ['view'],
		data: () => ({
			timeUnit: "Day",
			hideEmptyDaysEnabled: false,
			dateRange: {
				start: "",
				end: ""
			}
		}),
		watch: {
			// eslint-disable-next-line no-unused-vars
			$route: function(to, from) {
				this.sendDataRequestedEvent();
			}
		},
		methods: {
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view, this.dateRange, this.timeUnit);
			},
			resetChart() {
				this.dateRange.start = moment().subtract("30","days").format('YYYY-MM-DD');
				this.dateRange.end = moment().format('YYYY-MM-DD');

				this.timeUnit = "Day";

				this.sendDataRequestedEvent();
			}
		}
	}
</script>


<style scoped>
	.header {
		display: flex;
		height: 60px;
		align-items: center;
	}

	.empty-days-option-component {
		margin-left: auto;
	}

	.time-unit-picker-component {
		justify-self: flex-end;
		margin-left: 20px;
	}

	button {
		background: transparent;
		color: #885cca;
		border: none;
		outline: none;
		cursor: pointer;
		margin-left: 10px;
		font-family: Avenir, Helvetica, Arial, sans-serif;
		font-size: 14px;
	}

	button:hover {
		color: #542897;
	}
</style>