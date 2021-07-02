'use strict';

import moment from 'moment';

import daysFormatter from './formatters/days';
import weeksFormatter from './formatters/weeks';
import monthsFormatter from './formatters/months';
import yearsFormatter from './formatters/years';

export function formatData(timeUnit, range, data, displayAverage) {
	let rangeDates = getRangeDates(range);
	let rangeFlags = getRangeFlags();

	switch(timeUnit) {
	case "Day":
		return daysFormatter.formatDataInDays(data, rangeDates, rangeFlags);
	case "Week":
		return weeksFormatter.formatDataInWeeks(data, rangeDates, rangeFlags, displayAverage);
	case "Month":
		return monthsFormatter.formatDataInMonths(data, rangeDates, rangeFlags, displayAverage);
	case "Year":
		return yearsFormatter.formatDataInYears(data, rangeDates, rangeFlags, displayAverage);
	default:
		return daysFormatter.formatDataInDays(data, rangeDates, rangeFlags);
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