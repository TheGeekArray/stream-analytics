@@ -0,0 +1,142 @@
<script>
	import { ipcRenderer } from 'electron';

	export default {
		name: 'DataProcesser',
		data() {
			return {
				initialData: {},
				view: ""
			};
		},
		created() {
			this.setupListeners();
		},
		beforeMount() {
			this.sendDataRequestedEvent();
		},
		destroyed() {
			ipcRenderer.removeListener("dataProcessed", this.sendDataRequestedEvent);
			ipcRenderer.removeListener("dataLoaded", this.setInitialData);
		},
		methods: {
			setupListeners: function() {
				ipcRenderer.on("dataProcessed", this.sendDataRequestedEvent);
				ipcRenderer.on("dataLoaded", this.setInitialData);
			},
			sendDataRequestedEvent: function() {
				ipcRenderer.send("dataRequested", this.view);
			},
			setView: function(view) {
				this.view = view;
			},
			setInitialData: function(event, data) {
				this.initialData = data;
			},
			retrieveGroupedData(timeUnit, data) {
				switch(timeUnit) {
				case "Day":
					return this.getAllData(data);
				case "Week":
					return this.groupDataInWeeks(data);
				case "Month":
					return this.groupDataInMonths(data);
				case "Year":
					return this.groupDataInYears(data);
				default:
					return this.getAllData(data);
				}
			},
			getAllData(data) {
				let allData = [];
				let labels = [];

				for (let year in data) {
					for (let month in data[year]) {
						for (let day in data[year][month]) {
							allData.push(data[year][month][day]);
							labels.push(month + " " + day.split(" ")[1]);
						}
					}
				}

				return {data: allData, labels: labels };
			},
			groupDataInWeeks(data) {
				let groupedData = [];
				let labels = [];
				let weekDataTotal = 0;
				let divisor = 0;

				for (let year in data) {
					for (let month in data[year]) {
						for (let day in data[year][month]) {
							weekDataTotal += data[year][month][day];

							if (data[year][month][day] > parseFloat(0)) {
								divisor++;
							}

							let dayName = day.split(" ")[0];
							if (dayName === "Sat") {
								
								if (weekDataTotal === 0) {
									groupedData.push(0);
								} else {
									groupedData.push(weekDataTotal / divisor);
								}
								
								labels.push(month + " " + day.split(" ")[1]);
								weekDataTotal = 0;
								divisor = 0;
							}
						}
					}
				}

				return { data: groupedData, labels: labels };
			},
			groupDataInMonths(data) {
				let groupedData = [];
				let labels = [];

				for (let year in data) {
					for (let month in data[year]) {
						let monthDataTotal = 0;
						let divisor = 0;

						for (let day in data[year][month]) {
							if (data[year][month][day] === parseFloat(0)) continue;
							monthDataTotal += data[year][month][day];
							divisor++;
						}

						groupedData.push(monthDataTotal / divisor);
						labels.push(month + " " + year);
					}
				}

				return { data: groupedData, labels: labels };
			},
			groupDataInYears(data) {
				let groupedData = [];
				let labels = [];

				for (let year in data) {
					let yearDataTotal = 0;
					let divisor = 0;

					for (let month in data[year]) {
						for (let day in data[year][month]) {
							if (data[year][month][day] === parseFloat(0)) continue;
							yearDataTotal += data[year][month][day];
							divisor++;
						}
					}

					groupedData.push(yearDataTotal / divisor);
					labels.push(year);
				}

				return { data: groupedData, labels: labels };
			}
		}
	}
</script>