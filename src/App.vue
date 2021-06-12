<template>
	<div id="app">
		<!-- <div id="nav">
			<router-link to="/" v-if="this.$route.path !== '/'" class="menu-item-home">
				<font-awesome-icon icon="reply" class="back-icon" />
			</router-link>
			<router-link to="/settings"><font-awesome-icon icon="cog" class="settings-icon" /></router-link>
		</div> -->
		<router-view/>
	</div>
</template>

<style>
	body {
		width: 100vw;
		margin: 0;
		padding: 0;
		background-color: #242424;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #8f959b;
		width: 95%;
		margin: 0 auto;
	}

	#nav {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	#nav a {
		font-weight: bold;
		color:#8f959b;
		text-decoration: none;
	}

	.settings-icon {
		color:#616569;
		font-size: 35px;
		margin-left: 30px;
	}

	.back-icon {
		color:#616569;
		font-size: 35px;
	}
</style>
