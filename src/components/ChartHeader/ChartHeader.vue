<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
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
		methods: {
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view, this.dateRange, this.timeUnit);
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
</style>