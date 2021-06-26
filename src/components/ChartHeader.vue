<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; updateData();" />
		<EmptyDaysOption 
			v-bind:isChecked="hideEmptyDaysEnabled"
			v-bind:timeUnit="timeUnit"
			@change="hideEmptyDaysEnabled = $event; updateData();"
			class="empty-days-option-component"
		/>
		<TimeUnitPicker 
			@change="timeUnit = $event; updateData();"
			class="time-unit-picker-component"
		/>
	</div>
</template>

<script>
import DatePicker from '@/components/ChartHeader/DatePicker';
import EmptyDaysOption from '@/components/ChartHeader/EmptyDaysOption';
import TimeUnitPicker from '@/components/ChartHeader/TimeUnitPicker';

export default {
	name: 'ChartHeader',
	components: {
			DatePicker,
			EmptyDaysOption,
			TimeUnitPicker
		},
		data: () => ({
			timeUnit: "Day",
			hideEmptyDaysEnabled: false,
			dateRange: {
				start: "",
				end: ""
			}
		}),
		methods: {
			updateData() {
				this.$emit("change", {timeUnit: this.timeUnit, hideEmptyDaysEnabled: this.hideEmptyDaysEnabled, dateRange: this.dateRange});
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