'use strict';

import * as dataAccess from '../data-access';
import logger from '../../utils/logger';

export function mapLurkersData(uniqueViewersData, chattersData) {
	let lurkersData = dataAccess.getLoadedData("Lurkers");

	if (lurkersData == null) {
		logger.debug("No data for mapLurkersData");
		lurkersData = {};
	}

	for (const year in uniqueViewersData) {
		if (!lurkersData.hasOwnProperty(year)) {
			lurkersData[year] = {};
		}

		for (const month in uniqueViewersData[year]) {
			if (!lurkersData.hasOwnProperty(month)) {
				lurkersData[year][month] = {};
			}

			for (const day in uniqueViewersData[year][month]) {
				if (!lurkersData.hasOwnProperty(day)) {
					lurkersData[year][month][day] = {};
				}

				const uniqueViewers = parseFloat(uniqueViewersData[year][month][day]);
				const chatters = parseFloat(chattersData[year][month][day]);

				if (uniqueViewers === parseFloat(0) || chatters > uniqueViewers) {
					lurkersData[year][month][day] = 0;
				} else {
					lurkersData[year][month][day] = uniqueViewers - chatters;
				}
			}
		}
	}

	return lurkersData;
}