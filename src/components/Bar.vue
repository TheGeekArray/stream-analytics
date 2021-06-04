<script>
	import { Bar } from 'vue-chartjs';
	import 'chartjs-plugin-trendline';

	export default {
		extends: Bar,
		props: {
			data: Object,
			options: Object
		},
		mounted () {
			this.renderChart(this.data, this.options);
		}
	}
</script>