"use strict";

import moment from 'moment';

/**
 * @typedef FormattedData
 * @property {Object} data
 * @property {String[]} data.lurkers
 * @property {String[]} data.chatters
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
			chatters: [],
			lurkers: []
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

				groupedData.data.lurkers.push(data[year][month][day]["lurkers"]);
				groupedData.data.chatters.push(data[year][month][day]["chatters"]);
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
	let lurkersWeekDataTotal = 0;
	let chattersWeekDataTotal = 0;
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

				lurkersWeekDataTotal += data[year][month][day]["lurkers"];
				chattersWeekDataTotal += data[year][month][day]["chatters"];

				if (data[year][month][day]["lurkers"] > parseFloat(0)) {
					divisor++;
				}

				let dayName = day.split(" ")[0];
				if (dayName === "Sat") {
					
					if (lurkersWeekDataTotal === parseFloat(0)) {
						groupedData.data.chatters.push(0);
						groupedData.data.lurkers.push(0);
					} else {
						groupedData.data.chatters.push(lurkersWeekDataTotal / divisor);
						groupedData.data.lurkers.push(chattersWeekDataTotal / divisor);
					}
					
					groupedData.labels.push(month + " " + day.split(" ")[1]);
					lurkersWeekDataTotal = 0;
					chattersWeekDataTotal = 0;
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

			let lurkersMonthDataTotal = 0;
			let chattersMonthdataTotal = 0;
			let divisor = 0;

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				if (data[year][month][day]["lurkers"] === parseFloat(0)) continue;
				lurkersMonthDataTotal += data[year][month][day]["lurkers"];
				chattersMonthdataTotal += data[year][month][day]["chatters"];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}

			groupedData.data.lurkers.push(lurkersMonthDataTotal / divisor);
			groupedData.data.chatters.push(chattersMonthdataTotal / divisor);
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

		let lurkersYearDataTotal = 0;
		let chattersYearDataTotal = 0;
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

				if (data[year][month][day]["lurkers"] === parseFloat(0)) continue;
				lurkersYearDataTotal += data[year][month][day]["lurkers"];
				chattersYearDataTotal += data[year][month][day]["chatters"];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}

		groupedData.data.lurkers.push(lurkersYearDataTotal / divisor);
		groupedData.data.chatters.push(chattersYearDataTotal / divisor);
		groupedData.labels.push(year);
	}

	return groupedData;
}