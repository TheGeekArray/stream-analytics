'use strict';

import moment from 'moment';

export default {
	getGroupedDataInWeeks(data, rangeDates, rangeFlags) {
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
}