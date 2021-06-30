"use strict";

import logger from '../utils/logger';
import * as dataAccess from './data-access';
import * as organicViewers from './mappers/organic-viewers';
import * as artificialViewers from './mappers/artificial-viewers';
import * as minutesPerViewer from './mappers/minutes-per-viewer';
import * as lurkers from './mappers/lurkers';
import moment from 'moment';

export default {
	async mapData(data) {
		const splittedData = splitData(data);
		const topics = splittedData.shift();
		const dates = splittedData.map(row => row[0]);
		const fileName = getFileName(dates[0], dates[dates.length - 1]);
		const mappedData = {};

		let count = 0;
		for (const topic of topics) {
			if (topic === "Hosts and Raids Viewers (%)") {
				mappedData["Hosts & Raids"] = mapDataForTopic("Hosts & Raids", dates, count, splittedData);
			} else {
				mappedData[topic] = mapDataForTopic(topic, dates, count, splittedData);
			}

			count++;
		}

		mappedData["Organic Viewers"] = organicViewers.mapOrganicViewersData(mappedData["Average Viewers"], mappedData["Hosts & Raids"]);
		mappedData["Artificial Viewers"] = artificialViewers.mapArtificialViewersData(mappedData["Average Viewers"], mappedData["Hosts & Raids"]);
		mappedData["Minutes Per Viewer"] = minutesPerViewer.mapMinutesPerViewerData(mappedData["Minutes Watched"], mappedData["Unique Viewers"]);
		mappedData["Lurkers vs. Chatters"] = lurkers.mapLurkersData(mappedData["Unique Viewers"], mappedData["Chatters"]);

		return {mappedData, fileName};
	}
}

function mapDataForTopic(topic, dates, topicCount, data) {
	let topicData = dataAccess.getLoadedData(topic);

	if (topicData == null) {
		logger.debug("No data for mapData");
		topicData = {};
	}

	let count = 0;
	for (let line of data) {
		let date = getSplittedDate(dates[count]);

		if (!topicData.hasOwnProperty(date.year)) {
			topicData[date.year] = {};
		}
		if (!topicData[date.year].hasOwnProperty(date.month)) {
			topicData[date.year][date.month] = {};
		}

		topicData[date.year][date.month][date.dayName + " " + date.dayDate] = parseFloat(line[topicCount]);

		count++;
	}

	return topicData;
}

function getFileName(start, end) {
	const splittedStartDate = getSplittedDate(start);
	const splittedEndDate = getSplittedDate(end);

	const startDate = splittedStartDate.year + moment().month(splittedStartDate.month).format('MM') + splittedStartDate.dayDate;
	const endDate = splittedEndDate.year + moment().month(splittedEndDate.month).format('MM') + splittedEndDate.dayDate;

	return startDate + "-" + endDate;
}

function getSplittedDate(date) {
	const dateArray = date.split(" ");
	const timeUnits = ["dayName", "month", "dayDate", "year"];

	const splittedDate = timeUnits.reduce(
		(date, currentValue, index) => {
			date[currentValue] = dateArray[index];
			return date;
		}, {});

	return splittedDate;
}

function splitData(data) {
	const dataToSplit = data.split("\n");

	return dataToSplit.map(line => line.split(","));
}