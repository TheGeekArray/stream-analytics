<template>
	<div id="app">
		<div id="nav">
			<Navigation class="navigation" />
			<FileReader class="file-reader-component"/>
			<!-- <router-link to="/" v-if="this.$route.path !== '/'" class="menu-item-home">
				<font-awesome-icon icon="reply" class="back-icon" />
			</router-link>
			<router-link to="/settings"><font-awesome-icon icon="cog" class="settings-icon" /></router-link> -->
		</div>
		<router-view class="content"/>
	</div>
</template>

<script>
	import Navigation from '@/components/Navigation.vue';
	import FileReader from '@/components/FileReader.vue';

	export default {
		name: "App",
		components: {
			Navigation,
			FileReader
		}
	}
</script>

<style>
	body {
		width: 100vw;
		margin: 0;
		padding: 0;
		background-color: #242424;
		overflow: hidden;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-size: 14px;
		color: #888e94;
		width: 100%;
		
	}

	.content {
		width: 95%;
		margin: 30px auto;
	}

	#nav {
		height: 100px;
		background: rgb(26, 26, 26);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 0 30px;
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
