'use strict';

import * as dataAccess from '../data-access';

export function mapMinutesPerViewerData(minutesWatchedData, uniqueViewersData) {
	let minutesPerViewerData = dataAccess.getLoadedData("Minutes Per Viewer");

	if (minutesPerViewerData == null) {
		logger.debug("No data for mapMinutesPerViewerData");
		minutesPerViewerData = {};
	}

	for (const year in uniqueViewersData) {
		if (!minutesPerViewerData.hasOwnProperty(year)) {
			minutesPerViewerData[year] = {};
		}

		for (const month in uniqueViewersData[year]) {
			if (!minutesPerViewerData.hasOwnProperty(month)) {
				minutesPerViewerData[year][month] = {};
			}

			for (const day in uniqueViewersData[year][month]) {
				if (!minutesPerViewerData.hasOwnProperty(day)) {
					minutesPerViewerData[year][month][day] = 0;
				}

				const uniqueViewers = parseFloat(uniqueViewersData[year][month][day]);
				const minutesWatched = parseFloat(minutesWatchedData[year][month][day]);

				if (uniqueViewers === parseFloat(0) || minutesWatched === parseFloat(0)) {
					minutesPerViewerData[year][month][day] = 0;
					continue;
				}
		
				minutesPerViewerData[year][month][day] = minutesWatched / uniqueViewers;
			}
		}
	}

	return minutesPerViewerData;
}