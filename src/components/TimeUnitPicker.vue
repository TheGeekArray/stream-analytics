<template>
	<div class="time-unit-dropdown">
		<div class="select" v-bind:class="{ active: optionsVisible }" v-on:click="optionsVisible = !optionsVisible;" v-clickoutside="hideOptions">
			<span>{{selected}}</span>
			<font-awesome-icon v-if="!optionsVisible" icon="caret-down" class="caret-icon" />
			<font-awesome-icon v-else icon="caret-up" class="caret-icon" />
			<div class="select-options-container" v-show="optionsVisible">
				<div v-for="(unit, index) in timeUnits" :key="index" v-on:click="selected = unit; $emit('change', unit)" :value="unit" class="select-option">{{unit}}</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	export default {
		data: () => ({ 
			selected: "Day",
			timeUnits: ["Day", "Week", "Month", "Year"],
			optionsVisible: false
		}),
		methods: {
			hideOptions: function() {
				this.optionsVisible = false;
			}
		}
	}
</script>

<style scoped>
	.caret-icon {
		color: #fff;
		margin-left: auto;
	}

	.select {
		position: relative;
		display: flex;
		align-items: center;
		user-select: none;
		flex-wrap: wrap;
		font-size: 15px;
		width: 80px;
		padding: 10px 15px;
		background:  #3f3f3f;
		border: none;
		color: #FFF;
		border-radius: 3px;
		cursor: pointer;
	}

	.select:hover,
	.active {
		background: #2b2a2a;
	}

	.select span {
		margin-left: auto;
		margin-right: 10px;
	}

	.select .select-options-container {
		width: 100%;
		margin-top: 10px;
		position: absolute;
		background: #3f3f3f;
		top: 40px;
		left: 0;
		border-radius: 3px;
		box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.3);
		text-align: center;
	}

	.select .select-options-container .select-option {
		padding: 10px;
	}

	.select-option:hover {
		background: #2b2a2a;
	}

	.select:focus {
		outline: 1px solid rgb(134, 134, 134);
	}
</style>