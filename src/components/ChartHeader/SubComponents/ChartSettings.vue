<template>
	<div class="chart-settings" v-clickoutside="hideSettings">
		<font-awesome-icon icon="cog" class="button settings-button" v-on:click="settingsVisible = !settingsVisible;" />
		<div class="settings-container" v-show="settingsVisible">
			<div class="hide-empty-days">
				<Checkbox 
					ref="emptyDays"
					v-bind:description="`Hide ${timeUnit.toLowerCase() + 's'} not streamed`"
					v-on:input="shouldHideEmptyDays = $event; updateSettings()" 
				/>
			</div>
			<div class="hide-trend-line">
				<Checkbox 
					ref="trendLine"
					v-bind:description="`Hide trend line`" 
					v-on:input="shouldHideTrendline = $event; updateSettings()"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	import Checkbox from '@/components/InputComponents/Checkbox.vue';

	export default {
		name: "ChartSettings",
		components: {
			Checkbox
		},
		props: ['timeUnit'],
		data: () => ({
			settingsVisible: false,
			shouldHideEmptyDays: false,
			shouldHideTrendline: false
		}),
		methods: {
			hideSettings: function() {
				this.settingsVisible = false;
			},
			updateSettings: function() {
				let settings = {
					shouldHideEmptyDays: this.shouldHideEmptyDays,
					shouldHideTrendline: this.shouldHideTrendline
				}

				this.$emit('settings-updated', settings);
			}
		}
	}
</script>

<style scoped>
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
		color: #FFF;
		width: 200px;
		top: 40px;
		right: 0;
		border-radius: 3px;
		box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
		padding: 20px;
	}

	.settings-container div:not(:last-child) {
		margin-bottom: 20px;
	}
</style>