<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
		<button class="button reset-button" v-on:click="resetChart">Reset to 30 days</button>

		<TimeUnitPicker 
			@change="timeUnit = $event; sendDataRequestedEvent();"
			class="time-unit-picker-component"
			:key="timeUnitPickerKey"
		/>

		<div class="chart-settings" v-clickoutside="hideSettings">
			<font-awesome-icon icon="cog" class="button settings-button" v-on:click="settingsVisible = !settingsVisible;" />
			<div class="settings-container" v-show="settingsVisible">
				<div class="hide-empty-days">
					<Checkbox 
						ref="emptyDays"
						v-bind:description="`Hide ${timeUnit.toLowerCase() + 's'} not streamed`"
						v-on:input="$emit('toggle-empty-days', $event); sendDataRequestedEvent()" 
					/>
				</div>
				<div class="hide-trend-line">
					<Checkbox 
						ref="trendLine"
						v-bind:description="`Hide trend line`" 
						v-on:input="$emit('toggle-trendline', $event); sendDataRequestedEvent()"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Checkbox from '@/components/InputComponents/Checkbox';
	import DatePicker from '@/components/ChartHeader/SubComponents/DatePicker';
	import TimeUnitPicker from '@/components/ChartHeader/SubComponents/TimeUnitPicker';
	import { ipcRenderer } from 'electron';
	import moment from 'moment';

	export default {
		name: 'ChartHeader',
		components: {
			DatePicker,
			TimeUnitPicker,
			Checkbox
		},
		props: ['view'],
		data: () => ({
			timeUnit: "Day",
			settingsVisible: false,
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
				ipcRenderer.send("dataRequested", this.view, this.dateRange, this.timeUnit);
			},
			resetChart() {
				this.dateRange.start = moment().subtract("30","days").format('YYYY-MM-DD');
				this.dateRange.end = moment().format('YYYY-MM-DD');

				this.timeUnit = "Day";
				this.timeUnitPickerKey++;

				this.sendDataRequestedEvent();
			},
			hideSettings: function() {
				this.settingsVisible = false;
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

	.time-unit-picker-component {
		margin-left: auto;
	}

	.button {
		background: transparent;
		color: #885cca;
		border: none;
		outline: none;
		cursor: pointer;
		margin-left: 10px;
		font-family: Avenir, Helvetica, Arial, sans-serif;
	}

	.button:hover {
		color: #542897;
	}

	.reset-button {
		font-size: 14px;
	}

	.settings-button {
		font-size: 24px;
	}

	.chart-settings {
		position: relative;
		margin-left: 10px;
	}

	.settings-container {
		position: absolute;
		background: #3f3f3f;
		color: #FFF;
		width: 200px;
		top: 40px;
		right: 0;
		border-radius: 3px;
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
		padding: 20px;
	}

	.settings-container div:not(:last-child) {
		margin-bottom: 20px;
	}
</style>