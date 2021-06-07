"use strict";

export default {
	getGroupedData(timeUnit, data) {
		switch(timeUnit) {
		case "Day":
			return groupDataInDays(data);
		case "Week":
			return groupDataInWeeks(data);
		case "Month":
			return groupDataInMonths(data);
		case "Year":
			return groupDataInYears(data);
		default:
			return groupDataInDays(data);
		}
	}
}

function groupDataInDays(data) {
	let organicData = [];
	let artificialData = [];
	let labels = [];

	for (let year in data) {
		for (let month in data[year]) {
			for (let day in data[year][month]) {
				organicData.push(data[year][month][day]["organic"]);
				artificialData.push(data[year][month][day]["artificial"]);
				labels.push(month + " " + day.split(" ")[1]);
			}
		}
	}
	
	return {
		data: {
			organic: organicData,
			artificial: artificialData
		}, 
		labels: labels 
	};
}

function groupDataInWeeks(data) {
	let organicData = [];
	let artificialData = [];
	let labels = [];
	let organicWeekDataTotal = 0;
	let artificialWeekDataTotal = 0;
	let divisor = 0;

	for (let year in data) {
		for (let month in data[year]) {
			for (let day in data[year][month]) {
				organicWeekDataTotal += data[year][month][day]["organic"];
				artificialWeekDataTotal += data[year][month][day]["artificial"];

				if (data[year][month][day]["organic"] > parseFloat(0)) {
					divisor++;
				}

				let dayName = day.split(" ")[0];
				if (dayName === "Sat") {
					
					if (organicWeekDataTotal === parseFloat(0)) {
						organicData.push(0);
						artificialData.push(0);
					} else {
						organicData.push(organicWeekDataTotal / divisor);
						artificialData.push(artificialWeekDataTotal / divisor);
					}
					
					labels.push(month + " " + day.split(" ")[1]);
					organicWeekDataTotal = 0;
					artificialWeekDataTotal = 0;
					divisor = 0;
				}
			}
		}
	}

	return {
		data: {
			organic: organicData,
			artificial: artificialData
		}, 
		labels: labels 
	};
}

function groupDataInMonths(data) {
	let organicData = [];
	let artificialData = [];
	let labels = [];

	for (let year in data) {
		for (let month in data[year]) {
			let organicMonthDataTotal = 0;
			let artificialMonthdataTotal = 0;
			let divisor = 0;

			for (let day in data[year][month]) {
				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicMonthDataTotal += data[year][month][day]["organic"];
				artificialMonthdataTotal += data[year][month][day]["artificial"];
				divisor++;
			}

			organicData.push(organicMonthDataTotal / divisor);
			artificialData.push(artificialMonthdataTotal / divisor);
			labels.push(month + " " + year);
		}
	}

	return {
		data: {
			organic: organicData,
			artificial: artificialData
		}, 
		labels: labels 
	};
}

function groupDataInYears(data) {
	let organicData = [];
	let artificialData = [];
	let labels = [];

	for (let year in data) {
		let organicYearDataTotal = 0;
		let artificialYearDataTotal = 0;
		let divisor = 0;

		for (let month in data[year]) {
			for (let day in data[year][month]) {
				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicYearDataTotal += data[year][month][day]["organic"];
				artificialYearDataTotal += data[year][month][day]["artificial"];
				divisor++;
			}
		}

		organicData.push(organicYearDataTotal / divisor);
		artificialData.push(artificialYearDataTotal / divisor);
		labels.push(year);
	}

	return {
		data: {
			organic: organicData,
			artificial: artificialData
		}, 
		labels: labels 
	};
}