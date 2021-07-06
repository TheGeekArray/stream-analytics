<template>
	<div class="navigation">
		<font-awesome-icon class="button menu-button" icon="bars" v-on:click="collapsed = false"/>
		<div class="navigation-window" v-show="!collapsed" v-bind:class="{ hidden: collapsed }">
			<font-awesome-icon icon="times" class="button return-button" v-on:click="collapsed = true"/>
			<div class="navigation-items-container">
				<router-link :to="{name: 'OrganicViewers', params: { displayAverage: true }}" class="navigation-item" exact-active-class="navigation-item-active">
					<span v-on:click="collapsed = true">Organic vs. Artificial Viewers</span>
				</router-link>
				<router-link :to="{name: 'MinutesPerViewer', params: { displayAverage: true }}" exact-active-class="navigation-item-active" class="navigation-item">
					<span v-on:click="collapsed = true">Minutes Watched Per Unique Viewer</span>
				</router-link>
				<router-link :to="{name: 'LurkersVsChatters', params: { displayAverage: false }}" exact-active-class="navigation-item-active" class="navigation-item">
					<span v-on:click="collapsed = true">Chatters vs. Lurkers</span>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			collapsed: true
		}
	}
}
</script>


<style scoped>
	.navigation {
		font-size: 25px;
		position: relative;
	}

	.navigation-window {
		position: absolute;
		left: -30px;
		top: -35px;
		width: 300px;
		height: 100vh;
		background: #242424;
		box-shadow: 5px 10px 10px 10px rgb(0, 0, 0, 0.1);
		z-index: 9999;
		animation: slideIn 0.1s;
		display: flex;
		flex-direction: column;
	}

	.navigation-window .hidden {
		animation: slideOut 0.1s;
		width: 0;
	}

	@keyframes slideIn {
		from { width: 0; }
		to { width: 300px; }
	}

	@keyframes slideOut {
		from { width: 300px; }
		to { width: 0; }
	}

	.return-button {
		margin-top: 20px;
		margin-right: 20px;
		align-self: flex-end;
	}

	.navigation-items-container {
		display: flex;
		flex-direction: column;
		margin-top: 50px;
		width: 100%;
	}

	.navigation-item {
		font-size: 15px;
		align-self: flex-start;
		font-weight: normal;
	}

	.navigation-item span {
		color: #888e94;
		padding: 20px;
		width: 260px;
		display: block;
	}

	.navigation-item-active span,
	.navigation-item span:hover {
		background: rgb(26, 26, 26);
		color: #885cca;
	}
</style>