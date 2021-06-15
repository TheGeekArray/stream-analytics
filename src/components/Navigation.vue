<template>
	<div class="navigation">
		<font-awesome-icon class="menu-icon" icon="bars" v-on:click="collapsed = false"/>
		<div class="navigation-window" v-show="!collapsed" v-bind:class="{ hidden: collapsed }">
			<font-awesome-icon icon="reply" class="return-button" v-on:click="collapsed = true"/>
			<router-link to="/" class="navigation-item"><span v-on:click="collapsed = true">Organic vs. Artifical viewers</span></router-link>
			<router-link to="/minutes-per-viewer" class="navigation-item"><span v-on:click="collapsed = true">Minutes Watched Per Unique Viewer</span></router-link>
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
		display: flex;
		flex-direction: column;
		animation: slideIn 0.1s;
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

	.menu-icon {
		cursor: pointer;
	}

	.menu-icon:hover {
		color: #505050;
	}

	.return-button {
		color: #888e94;
		margin-top: 20px;
		margin-right: 20px;
		align-self: flex-end;
		cursor: pointer;
	}

	.return-button:hover {
		color: #505050;
	}

	.navigation-item {
		font-size: 16px;
		margin-top: 50px;
		align-self: center;
	}

	.navigation-item span {
		color: #888e94;
	}

	.navigation-item span:hover {
		color: #505050;
	}
</style>