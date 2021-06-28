"use strict";

import logger from '../utils/logger';
import * as dataAccess from './data-access';
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

		mappedData["Organic Viewers"] = mapOrganicViewersData(mappedData["Average Viewers"], mappedData["Hosts & Raids"]);
		mappedData["Minutes Per Viewer"] = mapMinutesPerViewerData(mappedData["Minutes Watched"], mappedData["Unique Viewers"]);
		mappedData["Lurkers vs. Chatters"] = mapLurkersVsChattersData(mappedData["Unique Viewers"], mappedData["Chatters"]);

		return {mappedData, fileName};
	}
}

function mapDataForTopic(topic, dates, topicCount, data) {
	let topicData = dataAccess.getData(topic);

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

function mapOrganicViewersData(averageViewersData, hostsAndRaidsData) {
	let organicViewersData = dataAccess.getData("Organic Viewers");

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

function mapMinutesPerViewerData(minutesWatchedData, uniqueViewersData) {
	let minutesPerViewerData = dataAccess.getData("Minutes Per Viewer");

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

function mapLurkersVsChattersData(uniqueViewersData, chattersData) {
	let lurkersVsChattersData = dataAccess.getData("Lurkers vs. Chatters");

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

				if (uniqueViewers === parseFloat(0)) {
					lurkersVsChattersData[year][month][day]["lurkers"] = 0;
					lurkersVsChattersData[year][month][day]["chatters"] = 0;
					continue;
				}
		
				lurkersVsChattersData[year][month][day]["lurkers"] = uniqueViewers - chatters;
				lurkersVsChattersData[year][month][day]["chatters"] = chatters;
			}
		}
	}

	return lurkersVsChattersData;
}