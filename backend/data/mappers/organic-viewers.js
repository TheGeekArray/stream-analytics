'use strict';

import * as dataAccess from './data-access';

export function mapOrganicViewersData(averageViewersData, hostsAndRaidsData) {
	let organicViewersData = dataAccess.getLoadedData("Organic Viewers");

	if (organicViewersData == null) {
		logger.debug("No data for mapOrganicViewersData");
		organicViewersData = {};
	}

	for (const year in averageViewersData) {
		if (!organicViewersData.hasOwnProperty(year)) {
			organicViewersData[year] = {};
		}

		for (const month in averageViewersData[year]) {
			if (!organicViewersData.hasOwnProperty(month)) {
				organicViewersData[year][month] = {};
			}

			for (const day in averageViewersData[year][month]) {
				if (!organicViewersData.hasOwnProperty(day)) {
					organicViewersData[year][month][day] = {};
				}

				const averageViewers = parseFloat(averageViewersData[year][month][day]);
				const hostsAndRaids = parseFloat(hostsAndRaidsData[year][month][day]);

				if (averageViewers === parseFloat(0)) {
					organicViewersData[year][month][day]["organic"] = 0;
					organicViewersData[year][month][day]["artificial"] = 0;
					continue;
				}

				if (hostsAndRaids === parseFloat(0)) {
					organicViewersData[year][month][day]["organic"] = averageViewers;
					organicViewersData[year][month][day]["artificial"] = 0;
					continue;
				}

				const percentage = (100 - hostsAndRaids) / 100;
				const organicAverage = averageViewers * percentage;
		
				organicViewersData[year][month][day]["organic"] = organicAverage;
				organicViewersData[year][month][day]["artificial"] = averageViewers - organicAverage;
			}
		}
	}

	return organicViewersData;
}