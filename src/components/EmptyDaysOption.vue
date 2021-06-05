<template>
	<div class="hide-empty-days-option">
		<input type="checkbox" :checked="isChecked" @change="$emit('change', $event.target.checked)"> Hide non-stream days
	</div>
</template>

<script>
export default {
	props: { isChecked: Boolean }
}
</script>
