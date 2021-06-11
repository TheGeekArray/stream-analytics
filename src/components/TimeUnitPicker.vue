<template>
	<div class="time-unit-dropdown">
		<select id="time-unit-dropdown-select" name="time-units" @change="getValue" v-model="selected">
			<option v-for="(unit, index) in timeUnits" :key="index" :value="unit">{{unit}}</option>
		</select>
	</div>
</template>

<script>
	export default {
		data: () => ({ 
			selected: "Day",
			timeUnits: ["Day", "Week", "Month", "Year"]
		}),
		methods: {
			getValue(event) {
				this.$emit("change", event.target.value);
			}
		}
	}
</script>