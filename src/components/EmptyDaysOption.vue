<template>
	<div class="hide-empty-days-option">
		<div class="checkbox-container" v-on:click="checked = !checked; $emit('change', checked)">
			<span class="checkbox"><span v-show="checked" class="checkbox-checked"></span></span>
			<span class="checkbox-label">Hide non-stream {{unit}}</span>
		</div>
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
			unit: "days",
			checked: false
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

<style scoped>
	.checkbox-container {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.checkbox {
		width: 15px;
		height: 15px;
		background-color: #b8babb;
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