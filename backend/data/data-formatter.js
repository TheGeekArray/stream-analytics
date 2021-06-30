'use strict';

import organicViewers from "./formatters/organic-viewers";
import minutesPerViewer from "./formatters/minutes-per-viewer";
import lurkersVsChatters from "./formatters/lurkers-vs-chatters";
import moment from 'moment';

export function formatData(timeUnit, range, topic, data) {
	let formattedData = {};
	let rangeDates = getRangeDates(range);
	let rangeFlags = getRangeFlags();

	switch (topic) {
		case "Organic Viewers":
			formattedData = organicViewers.formatData(timeUnit, rangeDates, rangeFlags, data);
			break;
		case "Minutes Per Viewer":
			formattedData = minutesPerViewer.formatData(timeUnit, rangeDates, rangeFlags, data);
			break;
		case "Lurkers vs. Chatters":
			formattedData = lurkersVsChatters.formatData(timeUnit, rangeDates, rangeFlags, data);
			break;
		default:
			return;
		}

	return formattedData;
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