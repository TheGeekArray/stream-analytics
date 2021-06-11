"use strict";

import moment from 'moment';

export default {
	getGroupedData(timeUnit, data) {
		switch(timeUnit) {
		case "30 days":
			return groupDataInThirtyDays(data);
		case "Day":
			return groupDataInDays(data);
		case "Week":
			return groupDataInWeeks(data);
		case "Month":
			return groupDataInMonths(data);
		case "Year":
			return groupDataInYears(data);
		default:
			return groupDataInThirtyDays(data);
		}
	},
	getRangedData(range, data) {
		let organicData = [];
		let artificialData = [];
		let labels = [];

		let splittedStartDate = range.start.split("-");
		let splittedEndDate = range.end.split("-");

		let flags = {
			start: {
				year: false,
				month: false,
				day: false
			},
			end: {
				year: false,
				month: false,
				day: false
			}
		}

		for (let year in data) {
			if (flags.end.day) break;
			if (!flags.start.year && splittedStartDate[0] !== year) {
				continue;
			} else {
				flags.start.year = true;
			}

			for (let month in data[year]) {
				if (flags.end.day) break;

				const formattedMonth = moment().month(month).format('MM');
				if (!flags.start.month && splittedStartDate[1] !== formattedMonth) {
					continue;
				} else {
					flags.start.month = true;
				}
	
				for (let day in data[year][month]) {
					if (flags.end.day) break;

					const dayNumber = day.split(" ")[1];
					if (!flags.start.day && splittedStartDate[2] !== dayNumber) {
						continue;
					} else {
						flags.start.day = true;
					}

					organicData.push(data[year][month][day]["organic"]);
					artificialData.push(data[year][month][day]["artificial"]);
					labels.push(month + " " + day.split(" ")[1]);

					if (splittedEndDate[0] === year && splittedEndDate[1] === formattedMonth && splittedEndDate[2] === dayNumber) {
						flags.end.day = true;
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
}

function groupDataInThirtyDays(data) {
	let dayData = groupDataInDays(data);
	let organicDayData = dayData.data.organic;
	let artificialDayData = dayData.data.artificial;

	if (!dayData.data || organicDayData.length < 0) return;

	return {
		data: {
			organic: organicDayData.slice((organicDayData.length - 30), organicDayData.length),
			artificial: artificialDayData.slice((artificialDayData.length - 30), artificialDayData.length)
		}, 
		labels: dayData.labels.slice((dayData.labels.length - 30), dayData.labels.length)
	};
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