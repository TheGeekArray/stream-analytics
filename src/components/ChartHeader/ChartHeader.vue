<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
		<button class="button reset-button" v-on:click="resetChart">Reset to 30 days</button>

		<TimeUnitPicker 
			@change="timeUnit = $event; sendDataRequestedEvent(); $emit('timeunit-updated', timeUnit)"
			class="time-unit-picker-component"
			:key="timeUnitPickerKey"
		/>

		<ChartSettings v-bind:timeUnit="timeUnit" v-on:settings-updated="$emit('settings-updated', $event); sendDataRequestedEvent();" />
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';
	import moment from 'moment';

	import DatePicker from '@/components/ChartHeader/SubComponents/DatePicker';
	import TimeUnitPicker from '@/components/ChartHeader/SubComponents/TimeUnitPicker';
	import ChartSettings from '@/components/ChartHeader/SubComponents/ChartSettings';

	export default {
		name: 'ChartHeader',
		components: {
			DatePicker,
			TimeUnitPicker,
			ChartSettings
		},
		props: ['topics', 'displayAverage'],
		data: () => ({
			timeUnit: "Day",
			dateRange: {
				start: "",
				end: ""
			},
			timeUnitPickerKey: 0
		}),
		watch: {
			// eslint-disable-next-line no-unused-vars
			$route: function(to, from) {
				this.sendDataRequestedEvent();
			}
		},
		methods: {
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.topics, this.displayAverage, this.dateRange, this.timeUnit);
			},
			resetChart() {
				this.dateRange.start = moment().subtract("30","days").format('YYYY-MM-DD');
				this.dateRange.end = moment().format('YYYY-MM-DD');

				this.timeUnit = "Day";
				this.timeUnitPickerKey++;

				this.sendDataRequestedEvent();
			}
		}
	}
</script>


<style>
	.header {
		display: flex;
		height: 60px;
		align-items: center;
	}

	.time-unit-picker-component {
		margin-left: auto;
	}

	.reset-button {
		font-size: 14px;
	}
</style>