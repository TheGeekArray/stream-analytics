'use strict';

import moment from 'moment';

export function formatData(timeUnit, range, data) {
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

function getGroupedDataInDays(data, rangeDates, rangeFlags) {
	let formattedData = [];
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

				formattedData.push(data[year][month][day]);
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
	let formattedData = [];
	let labels = [];
	let weekDataTotal = 0;
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

				weekDataTotal += data[year][month][day];

				if (data[year][month][day] > parseFloat(0)) {
					divisor++;
				}

				let dayName = day.split(" ")[0];
				if (dayName === "Sat") {
					
					if (weekDataTotal === parseFloat(0)) {
						formattedData.push(0);
					} else {
						formattedData.push(weekDataTotal / divisor);
					}
					
					labels.push(month + " " + day.split(" ")[1]);
					weekDataTotal = 0;
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
	let formattedData = [];
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

			let monthDataTotal = 0;
			let divisor = 0;

			for (let day in data[year][month]) {
				if (rangeFlags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!rangeFlags.start.day && rangeDates.start[2] !== dayNumber) {
					continue;
				} else {
					rangeFlags.start.day = true;
				}

				if (data[year][month][day] === parseFloat(0)) continue;
				monthDataTotal += data[year][month][day];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}

			formattedData.push(monthDataTotal / divisor);
			labels.push(month + " " + year);
		}
	}


	return {formattedData, labels};
}

function getGroupedDataInYears(data, rangeDates, rangeFlags) {
	let formattedData = [];
	let labels = [];

	for (let year in data) {
		if (rangeFlags.end) break;
		if (!rangeFlags.start.year && rangeDates.start[0] !== year) {
			continue;
		} else {
			rangeFlags.start.year = true;
		}

		let yearDataTotal = 0;
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

				if (data[year][month][day] === parseFloat(0)) continue;
				yearDataTotal += data[year][month][day];
				divisor++;

				if (rangeDates.end[0] === year && rangeDates.end[1] === formattedMonth && rangeDates.end[2] === dayNumber) {
					rangeFlags.end = true;
				}
			}
		}

		formattedData.push(yearDataTotal / divisor);
		labels.push(year);
	}

	return {formattedData, labels};
}