<template>
	<div class="chart-settings" v-clickoutside="hideSettings">
		<font-awesome-icon icon="cog" class="button settings-button" v-on:click="settingsVisible = !settingsVisible;" />
		<div class="settings-container" v-show="settingsVisible">
			<div class="general-settings">
				<h3>General</h3>
				<div class="setting hide-empty-days">
					<Checkbox 
						v-bind:description="`Hide ${timeUnit.toLowerCase() + 's'} not streamed`"
						v-on:input="shouldHideEmptyDays = $event; updateSettings()" 
					/>
				</div>
				<div class="setting hide-trend-line">
					<Checkbox 
						v-bind:description="`Hide trend line`" 
						v-on:input="shouldHideTrendline = $event; updateSettings()"
					/>
				</div>
			</div>
			<div v-show="$route.name === 'OrganicViewers'" class="view-settings">
				<h3>This view</h3>
				<div class="setting hide-total-average">
					<Checkbox 
						v-bind:description="`Hide total organic average`" 
						v-on:input="shouldHideTotalAverage = $event; updateSettings()"
					/>
				</div>
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
					shouldHideTrendline: this.shouldHideTrendline,
					shouldHideTotalAverage: this.shouldHideTotalAverage
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
		padding: 0 20px 20px 20px;
	}

	h3 {
		color: #aaaaaa;
		font-size: 15px;
		margin-top: 20px;
	}

	.setting {
		margin-left: 5px;
		margin-bottom: 10px;
	}
</style>