<template>
	<div class="hide-empty-days-option">
		<input type="checkbox" @change="$emit('change', $event.target.checked)"> Hide non-stream days
	</div>
</template>