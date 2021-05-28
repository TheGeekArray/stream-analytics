<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ["data", "options", "label"],
  mounted () {
    const organicAverage = this.calculateOrganicAverage(this.data["Average Viewers"], this.data["Hosts and Raids Viewers (%)"]);
    const artificialAverage = this.calculateArticifialAverage(this.data["Average Viewers"], organicAverage);

    const chartdata = {
      labels: this.data["Date"],
      datasets: [{
        label: "Organic",
        backgroundColor: "#772ce8",
        data: organicAverage
      },
      {
        label: "Artificial",
        backgroundColor: "#18181b",
        data: artificialAverage
      }]
    };

    this.renderChart(chartdata, this.options);
  },
  methods: {
    calculateOrganicAverage: function (averageViewers, hostsAndRaids) {
      const organicAverage = [];

      for (let i = 0; i < averageViewers.length; i++) {
        let average = (1 - (hostsAndRaids[i] / 100)) * averageViewers[i];
        organicAverage.push(average);
      }

      return organicAverage;
    },
    calculateArticifialAverage: function (averageViewers, organicAverage) {
      const artificialAverage = [];

      for (let i = 0; i < averageViewers.length; i++) {
        let average = averageViewers[i] - organicAverage[i];
        artificialAverage.push(average);
      }

      return artificialAverage;
    }
  }
}
</script>