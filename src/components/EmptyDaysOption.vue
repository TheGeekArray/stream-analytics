<template>
	<div class="hide-empty-days-option">
		<input type="checkbox" :checked="isChecked" @change="$emit('change', $event.target.checked)"> Hide non-stream {{unit}}
	</div>
</template>

<script>
export default {
	props: { 
		isChecked: Boolean,
		timeUnit: String
	},
	data: function() {
		return {
			unit: "days"
		}
	},
	watch: {
		timeUnit: function(value) {
			switch(value) {
				case "30 days":
				case "Day":
					this.unit = "days";
					break;
				case "Week":
					this.unit = "weeks";
					break;
				case "Month":
					this.unit = "months";
					break;
				case "Year":
					this.unit = "years";
					break;
				default:
					this.unit = "time";
					break;
			}
		}
	}
}
</script>
