'use strict';

import * as dataAccess from '../data-access';
import logger from '../../utils/logger';

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
					organicViewersData[year][month][day] = 0;
					continue;
				}

				const percentage = (100 - hostsAndRaids) / 100;
		
				organicViewersData[year][month][day] = averageViewers * percentage;
			}
		}
	}

	return organicViewersData;
}