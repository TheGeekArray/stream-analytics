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
		const args = {
			data: data,
			range: {
				start: range.start.split("-"),
				end: range.end.split("-"),
				flags: {
					start: {
						year: false,
						month: false,
						day: false
					},
					end: false
				}
			},
		}

		if (!range.start || !range.end) {
			const today = moment().format("YYYY-MM-DD");
			const startDate = moment(today).subtract("30", "days").format("YYYY-MM-DD");
			args.range.end = today.split("-");
			args.range.start = startDate.split("-");
		}

		console.log(args.range);

		switch(timeUnit) {
		case "Day":
			return groupDataInDays(args);
		case "Week":
			return groupDataInWeeks(args);
		case "Month":
			return groupDataInMonths(args);
		case "Year":
			return groupDataInYears(args);
		default:
			return groupDataInDays(args);
		}
	},
}

function groupDataInDays(args) {
	let data = args.data;
	let range = args.range;
	let flags = range.flags;

	/** @type {FormattedData} */
	let groupedData = {
		data: {
			organic: [],
			artificial: []
		}, 
		labels: []
	}

	for (let year in data) {
		if (flags.end) break;
		if (!flags.start.year && range.start[0] !== year) {
			continue;
		} else {
			flags.start.year = true;
		}

		for (let month in data[year]) {
			if (flags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!flags.start.month && range.start[1] !== formattedMonth) {
				continue;
			} else {
				flags.start.month = true;
			}
	
			for (let day in data[year][month]) {
				if (flags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!flags.start.day && range.start[2] !== dayNumber) {
					continue;
				} else {
					flags.start.day = true;
				}

				groupedData.data.organic.push(data[year][month][day]["organic"]);
				groupedData.data.artificial.push(data[year][month][day]["artificial"]);
				groupedData.labels.push(month + " " + day.split(" ")[1]);

				if (range.end[0] === year && range.end[1] === formattedMonth && range.end[2] === dayNumber) {
					flags.end = true;
				}
			}
		}
	}
	
	return groupedData;
}

function groupDataInWeeks(args) {
	let data = args.data;
	let range = args.range;
	let flags = range.flags;

	/** @type {FormattedData} */
	let groupedData = {
		data: {
			organic: [],
			artificial: []
		}, 
		labels: []
	}

	let organicWeekDataTotal = 0;
	let artificialWeekDataTotal = 0;
	let divisor = 0;

	for (let year in data) {
		if (flags.end) break;
		if (!flags.start.year && range.start[0] !== year) {
			continue;
		} else {
			flags.start.year = true;
		}

		for (let month in data[year]) {
			if (flags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!flags.start.month && range.start[1] !== formattedMonth) {
				continue;
			} else {
				flags.start.month = true;
			}

			for (let day in data[year][month]) {
				if (flags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!flags.start.day && range.start[2] !== dayNumber) {
					continue;
				} else {
					flags.start.day = true;
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

				if (range.end[0] === year && range.end[1] === formattedMonth && range.end[2] === dayNumber) {
					flags.end = true;
				}
			}
		}
	}

	return groupedData;
}

function groupDataInMonths(args) {
	let data = args.data;
	let range = args.range;
	let flags = range.flags;

	/** @type {FormattedData} */
	let groupedData = {
		data: {
			organic: [],
			artificial: []
		}, 
		labels: []
	}

	for (let year in data) {
		if (flags.end) break;
		if (!flags.start.year && range.start[0] !== year) {
			continue;
		} else {
			flags.start.year = true;
		}

		for (let month in data[year]) {
			if (flags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!flags.start.month && range.start[1] !== formattedMonth) {
				continue;
			} else {
				flags.start.month = true;
			}

			let organicMonthDataTotal = 0;
			let artificialMonthdataTotal = 0;
			let divisor = 0;

			for (let day in data[year][month]) {
				if (flags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!flags.start.day && range.start[2] !== dayNumber) {
					continue;
				} else {
					flags.start.day = true;
				}

				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicMonthDataTotal += data[year][month][day]["organic"];
				artificialMonthdataTotal += data[year][month][day]["artificial"];
				divisor++;

				if (range.end[0] === year && range.end[1] === formattedMonth && range.end[2] === dayNumber) {
					flags.end = true;
				}
			}

			groupedData.data.organic.push(organicMonthDataTotal / divisor);
			groupedData.data.artificial.push(artificialMonthdataTotal / divisor);
			groupedData.labels.push(month + " " + year);
		}
	}

	return groupedData;
}

function groupDataInYears(args) {
	let data = args.data;
	let range = args.range;
	let flags = range.flags;

	/** @type {FormattedData} */
	let groupedData = {
		data: {
			organic: [],
			artificial: []
		}, 
		labels: []
	}

	for (let year in data) {
		if (flags.end) break;
		if (!flags.start.year && range.start[0] !== year) {
			continue;
		} else {
			flags.start.year = true;
		}

		let organicYearDataTotal = 0;
		let artificialYearDataTotal = 0;
		let divisor = 0;

		for (let month in data[year]) {
			if (flags.end) break;

			const formattedMonth = moment().month(month).format('MM');
			if (!flags.start.month && range.start[1] !== formattedMonth) {
				continue;
			} else {
				flags.start.month = true;
			}

			for (let day in data[year][month]) {
				if (flags.end) break;

				const dayNumber = day.split(" ")[1];
				if (!flags.start.day && range.start[2] !== dayNumber) {
					continue;
				} else {
					flags.start.day = true;
				}

				if (data[year][month][day]["organic"] === parseFloat(0)) continue;
				organicYearDataTotal += data[year][month][day]["organic"];
				artificialYearDataTotal += data[year][month][day]["artificial"];
				divisor++;

				if (range.end[0] === year && range.end[1] === formattedMonth && range.end[2] === dayNumber) {
					flags.end = true;
				}
			}
		}

		groupedData.data.organic.push(organicYearDataTotal / divisor);
		groupedData.data.artificial.push(artificialYearDataTotal / divisor);
		groupedData.labels.push(year);
	}

	return groupedData;
}