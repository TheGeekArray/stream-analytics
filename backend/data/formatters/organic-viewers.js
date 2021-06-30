"use strict";

import moment from 'moment';

export default {
	formatData(timeUnit, rangeDates, rangeFlags, data) {
		switch(timeUnit) {
		case "Day":
			return getGroupedDataInDays(data, rangeDates, rangeFlags);
		case "Week":
			return getGroupedDataInWeeks(data, rangeDates, rangeFlags);
		case "Month":
			return getGroupedDataInMonths(data, rangeDates, rangeFlags);
		case "Year":
			return getGroupedDataInYears(data, rangeDates, rangeFlags);
		default:
			return getGroupedDataInDays(data, rangeDates, rangeFlags);
		}
	}
}

function getGroupedDataInDays(data, rangeDates, rangeFlags) {
	let formattedData = [[], []];
	let labels = [];

	for (let year in data) {
		if (rangeFlags.end) break;
		if (!rangeFlags.start.year && rangeDates.start[0] !== year) {
			continue;
		} else {
			rangeFlags.start.year = true;
		}

		for (let month in data[year]) {
			if (rangeFlags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!rangeFlags.start.month && rangeDates.start[1] !== formattedMonth) {
				continue;
			} else {
				rangeFlags.start.month = true;
			}

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				formattedData[0].push(data[year][month][day]["organic"]);
				formattedData[1].push(data[year][month][day]["artificial"]);
				labels.push(month + " " + day.split(" ")[1] + " " + year);

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}
	}
	
	return {formattedData, labels};
}

function getGroupedDataInWeeks(data, rangeDates, rangeFlags) {
	let formattedData = [[], []];
	let labels = [];
	let organicWeekDataTotal = 0;
	let artificialWeekDataTotal = 0;
	let divisor = 0;

	for (let year in data) {
		if (rangeFlags.end) break;
		if (!rangeFlags.start.year && rangeDates.start[0] !== year) {
			continue;
		} else {
			rangeFlags.start.year = true;
		}

		for (let month in data[year]) {
			if (rangeFlags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!rangeFlags.start.month && rangeDates.start[1] !== formattedMonth) {
				continue;
			} else {
				rangeFlags.start.month = true;
			}

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				organicWeekDataTotal += data[year][month][day]["organic"];
				artificialWeekDataTotal += data[year][month][day]["artificial"];

				if (data[year][month][day]["organic"] > parseFloat(0)) {
					divisor++;
				}

				let dayName = day.split(" ")[0];
				if (dayName === "Sat") {
					
					if (organicWeekDataTotal === parseFloat(0)) {
						formattedData[0].push(0);
						formattedData[1].push(0);
					} else {
						formattedData[0].push(organicWeekDataTotal / divisor);
						formattedData[1].push(artificialWeekDataTotal / divisor);
					}
					
					labels.push(month + " " + day.split(" ")[1]);
					organicWeekDataTotal = 0;
					artificialWeekDataTotal = 0;
					divisor = 0;
				}

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}
	}

	return {formattedData, labels};
}

function getGroupedDataInMonths(data, rangeDates, rangeFlags) {
	let formattedData = [[], []];
	let labels = [];

	for (let year in data) {
		if (rangeFlags.end) break;
		if (!rangeFlags.start.year && rangeDates.start[0] !== year) {
			continue;
		} else {
			rangeFlags.start.year = true;
		}

		for (let month in data[year]) {
			if (rangeFlags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!rangeFlags.start.month && rangeDates.start[1] !== formattedMonth) {
				continue;
			} else {
				rangeFlags.start.month = true;
			}

			let organicMonthDataTotal = 0;
			let artificialMonthdataTotal = 0;
			let divisor = 0;

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicMonthDataTotal += data[year][month][day]["organic"];
				artificialMonthdataTotal += data[year][month][day]["artificial"];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}

			formattedData[0].push(organicMonthDataTotal / divisor);
			formattedData[1].push(artificialMonthdataTotal / divisor);
			labels.push(month + " " + year);
		}
	}


	return {formattedData, labels};
}

function getGroupedDataInYears(data, rangeDates, rangeFlags) {
	let formattedData = [[], []];
	let labels = [];

	for (let year in data) {
		if (rangeFlags.end) break;
		if (!rangeFlags.start.year && rangeDates.start[0] !== year) {
			continue;
		} else {
			rangeFlags.start.year = true;
		}

		let organicYearDataTotal = 0;
		let artificialYearDataTotal = 0;
		let divisor = 0;

		for (let month in data[year]) {
			if (rangeFlags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!rangeFlags.start.month && rangeDates.start[1] !== formattedMonth) {
				continue;
			} else {
				rangeFlags.start.month = true;
			}

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicYearDataTotal += data[year][month][day]["organic"];
				artificialYearDataTotal += data[year][month][day]["artificial"];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}

		formattedData[0].push(organicYearDataTotal / divisor);
		formattedData[1].push(artificialYearDataTotal / divisor);
		labels.push(year);
	}

	return {formattedData, labels};
}