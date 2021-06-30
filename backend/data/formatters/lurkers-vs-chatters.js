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

				formattedData[0].push(data[year][month][day]["chatters"]);
				formattedData[1].push(data[year][month][day]["lurkers"]);
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
	let lurkersWeekDataTotal = 0;
	let chattersWeekDataTotal = 0;

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

				let dayName = day.split(" ")[0];
				if (dayName === "Sat") {
					
					formattedData[0].push(chattersWeekDataTotal);
					formattedData[1].push(lurkersWeekDataTotal);
					labels.push(month + " " + day.split(" ")[1]);

					lurkersWeekDataTotal = 0;
					chattersWeekDataTotal = 0;
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

			let lurkersMonthDataTotal = 0;
			let chattersMonthdataTotal = 0;

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				lurkersMonthDataTotal += data[year][month][day]["lurkers"];
				chattersMonthdataTotal += data[year][month][day]["chatters"];

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}

			formattedData[0].push(chattersMonthdataTotal);
			formattedData[1].push(lurkersMonthDataTotal);
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

		let lurkersYearDataTotal = 0;
		let chattersYearDataTotal = 0;

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

				lurkersYearDataTotal += data[year][month][day]["lurkers"];
				chattersYearDataTotal += data[year][month][day]["chatters"];

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}

		formattedData[0].push(chattersYearDataTotal);
		formattedData[1].push(lurkersYearDataTotal);
		labels.push(year);
	}

	return {formattedData, labels};
}