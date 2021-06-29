<template>
	<div class="checkbox-container" v-on:click="checked = !checked; $emit('input', checked);">
		<span class="checkbox"><span v-show="checked" class="checkbox-checked"></span></span>
		<span class="checkbox-label">{{ description }}</span>
	</div>
</template>

<script>
export default {
	props: ["description"],
	data: function() {
		return {
			checked: false
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