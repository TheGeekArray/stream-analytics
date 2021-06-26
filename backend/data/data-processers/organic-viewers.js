"use strict";

import moment from 'moment';

/**
 * @typedef FormattedData
 * @property {Object} data
 * @property {String[]} data.organic
 * @property {String[]} data.artificial
 * @property {String[]} labels
 */

export default {
	getGroupedData(timeUnit, range, data) {
		let rangeDates = getRangeDates(range);
		let rangeFlags = getRangeFlags();

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

function getRangeDates(range) {
	if (!range.start || !range.end) {
		const today = moment().format("YYYY-MM-DD");
		const startDate = moment(today).subtract("30", "days").format("YYYY-MM-DD");

		return {
			start: startDate.split("-"),
			end: today.split("-")
		};
	}

	return {
		start: range.start.split("-"),
		end: range.end.split("-")
	};
}

function getRangeFlags() {
	return {
		start: {
			year: false,
			month: false,
			day: false
		},
		end: false
	}
}

function getGroupedDataFormat() {
	/** @type {FormattedData} */
	return {
		data: {
			organic: [],
			artificial: []
		}, 
		labels: []
	}
}

function getGroupedDataInDays(data, rangeDates, rangeFlags) {
	let groupedData = getGroupedDataFormat();

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

				groupedData.data.organic.push(data[year][month][day]["organic"]);
				groupedData.data.artificial.push(data[year][month][day]["artificial"]);
				groupedData.labels.push(month + " " + day.split(" ")[1] + " " + year);

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}
	}
	
	return groupedData;
}

function getGroupedDataInWeeks(data, rangeDates, rangeFlags) {
	let groupedData = getGroupedDataFormat();
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
						groupedData.data.organic.push(0);
						groupedData.data.artificial.push(0);
					} else {
						groupedData.data.organic.push(organicWeekDataTotal / divisor);
						groupedData.data.artificial.push(artificialWeekDataTotal / divisor);
					}
					
					groupedData.labels.push(month + " " + day.split(" ")[1]);
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

	return groupedData;
}

function getGroupedDataInMonths(data, rangeDates, rangeFlags) {
	let groupedData = getGroupedDataFormat();

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

			groupedData.data.organic.push(organicMonthDataTotal / divisor);
			groupedData.data.artificial.push(artificialMonthdataTotal / divisor);
			groupedData.labels.push(month + " " + year);
		}
	}


	return groupedData;
}

function getGroupedDataInYears(data, rangeDates, rangeFlags) {
	let groupedData = getGroupedDataFormat();

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

		groupedData.data.organic.push(organicYearDataTotal / divisor);
		groupedData.data.artificial.push(artificialYearDataTotal / divisor);
		groupedData.labels.push(year);
	}

	return groupedData;
}