'use strict';

import * as dataAccess from './data-access';

export function mapLurkersVsChattersData(uniqueViewersData, chattersData) {
	let lurkersVsChattersData = dataAccess.getLoadedData("Lurkers vs. Chatters");

	if (lurkersVsChattersData == null) {
		logger.debug("No data for mapLurkersVsChattersData");
		lurkersVsChattersData = {};
	}

	for (const year in uniqueViewersData) {
		if (!lurkersVsChattersData.hasOwnProperty(year)) {
			lurkersVsChattersData[year] = {};
		}

		for (const month in uniqueViewersData[year]) {
			if (!lurkersVsChattersData.hasOwnProperty(month)) {
				lurkersVsChattersData[year][month] = {};
			}

			for (const day in uniqueViewersData[year][month]) {
				if (!lurkersVsChattersData.hasOwnProperty(day)) {
					lurkersVsChattersData[year][month][day] = {};
				}

				const uniqueViewers = parseFloat(uniqueViewersData[year][month][day]);
				const chatters = parseFloat(chattersData[year][month][day]);

				if (uniqueViewers === parseFloat(0) || chatters > uniqueViewers) {
					lurkersVsChattersData[year][month][day]["lurkers"] = 0;
					lurkersVsChattersData[year][month][day]["chatters"] = 0;
				} else {
					lurkersVsChattersData[year][month][day]["lurkers"] = uniqueViewers - chatters;
					lurkersVsChattersData[year][month][day]["chatters"] = chatters;
				}
			}
		}
	}

	return lurkersVsChattersData;
}