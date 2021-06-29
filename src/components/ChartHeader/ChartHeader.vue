<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
		<button class="button reset-button" v-on:click="resetChart">Reset to 30 days</button>

		<TimeUnitPicker 
			@change="timeUnit = $event; sendDataRequestedEvent();"
			class="time-unit-picker-component"
		/>

		<div class="chart-settings">
			<font-awesome-icon icon="cog" class="button settings-button" v-on:click="settingsVisible = !settingsVisible;" v-clickoutside="hideSettings" />
			<div class="settings-container" v-show="settingsVisible">
				<div class="hide-empty-days">
					<div class="checkbox-container" v-on:click="hideEmptyDaysEnabled = !hideEmptyDaysEnabled; $emit('change', hideEmptyDaysEnabled); sendDataRequestedEvent()">
						<span class="checkbox"><span v-show="hideEmptyDaysEnabled" class="checkbox-checked"></span></span>
						<span class="checkbox-label">Hide {{timeUnit.toLowerCase() + "s"}} not streamed</span>
					</div>
				</div>
				<div class="hide-trend-line">
					<div class="checkbox-container" v-on:click="trendlineVisible = !trendlineVisible">
						<span class="checkbox"><span v-show="trendlineVisible" class="checkbox-checked"></span></span>
						<span class="checkbox-label">Hide trend line</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import DatePicker from '@/components/ChartHeader/SubComponents/DatePicker';
	import TimeUnitPicker from '@/components/ChartHeader/SubComponents/TimeUnitPicker';
	import { ipcRenderer } from 'electron';
	import moment from 'moment';

	export default {
		name: 'ChartHeader',
		components: {
			DatePicker,
			TimeUnitPicker
		},
		props: ['view'],
		data: () => ({
			timeUnit: "Day",
			hideEmptyDaysEnabled: false,
			settingsVisible: false,
			trendlineVisible: true,
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
		width: 200px;
		top: 40px;
		right: 0;
		border-radius: 3px;
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
		padding: 20px;
	}

		.checkbox-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.checkbox {
		width: 15px;
		height: 15px;
		background-color: #e2e2e2;
		margin-right: 10px;
		position: relative;
	}

	.checkbox-checked {
		width: 15px;
		height: 15px;
		background: #772ce8;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkbox-checked::after {
		content: "\2713";
		color: #fff;
		font-size: 17px;
		width: 14px;
		height: 22px;
		font-weight: 600;
		display: inline-block;
	}
</style>