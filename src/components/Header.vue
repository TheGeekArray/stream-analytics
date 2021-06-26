<template>
	<div class="header">
		<DatePicker @change="dateRange = $event; sendDataRequestedEvent();" />
		<EmptyDaysOption 
			v-bind:isChecked="hideEmptyDaysEnabled"
			v-bind:timeUnit="timeUnit"
			@change="hideEmptyDaysEnabled = $event; sendDataRequestedEvent();"
			class="empty-days-option-component"
		/>
		<TimeUnitPicker 
			@change="timeUnit = $event; sendDataRequestedEvent();"
			class="time-unit-picker-component"
		/>
	</div>
</template>

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