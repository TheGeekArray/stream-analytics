<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ["data", "options", "label"],
  mounted () {
    const chartdata = {
      labels: this.data["Date"],
      datasets: [
        {
          label: this.label,
          backgroundColor: "#772ce8",
          data: this.data[this.label],
        }
      ]
    };

    this.renderChart(chartdata, this.options);
  }
}
</script>