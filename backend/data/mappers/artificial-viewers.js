'use strict';

import * as dataAccess from '../data-access';

export function mapArtificialViewersData(averageViewersData, hostsAndRaidsData) {
	let artificialViewersData = dataAccess.getLoadedData("Artificial Viewers");

	if (artificialViewersData == null) {
		logger.debug("No data for mapArtificialViewersData");
		artificialViewersData = {};
	}

	for (const year in averageViewersData) {
		if (!artificialViewersData.hasOwnProperty(year)) {
			artificialViewersData[year] = {};
		}

		for (const month in averageViewersData[year]) {
			if (!artificialViewersData.hasOwnProperty(month)) {
				artificialViewersData[year][month] = {};
			}

			for (const day in averageViewersData[year][month]) {
				if (!artificialViewersData.hasOwnProperty(day)) {
					artificialViewersData[year][month][day] = {};
				}

				const averageViewers = parseFloat(averageViewersData[year][month][day]);
				const hostsAndRaids = parseFloat(hostsAndRaidsData[year][month][day]);

				if (averageViewers === parseFloat(0)) {
					artificialViewersData[year][month][day] = 0;
					continue;
				}
		
				artificialViewersData[year][month][day] = averageViewers * (hostsAndRaids / 100);
			}
		}
	}

	return artificialViewersData;
}