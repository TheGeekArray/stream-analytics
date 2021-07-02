<template>
	<div id="app">
		<div class="nav">
			<Navigation class="navigation" />
			<FileReader class="file-reader-component"/>
		</div>
		<router-view class="content"/>
	</div>
</template>

<script>
	import Navigation from '@/components/AppHeader/Navigation.vue';
	import FileReader from '@/components/AppHeader/FileReader.vue';

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

	.nav {
		height: 100px;
		background: rgb(26, 26, 26);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 0 30px;
	}

	.nav a {
		color:#8f959b;
		text-decoration: none;
	}

	.button {
		background: transparent;
		color: #885cca;
		border: none;
		outline: none;
		cursor: pointer;
		margin-left: 10px;
		font-family: Avenir, Helvetica, Arial, sans-serif;
	}

	.button:hover {
		color: #542897;
	}
</style>
