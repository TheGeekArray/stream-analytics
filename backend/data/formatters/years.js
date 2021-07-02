'use strict';

import moment from 'moment';

export default {
	getGroupedDataInYears(data, rangeDates, rangeFlags) {
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
}