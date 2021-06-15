"use strict";

import logger from '../utils/logger';
import { getData } from './data-access';

export default {
	async mapData(data) {
		const splittedData = splitData(data);
		const topics = splittedData.shift();
		const dates = splittedData.map(row => row[0]);
		const mappedData = {};

		let count = 0;
		for (const topic of topics) {
			switch (topic) {
			case "Average Viewers":
				mappedData["Average Viewers"] = mapDataForTopic(topic, dates, count, splittedData);
			case "Hosts and Raids Viewers (%)":
				mappedData["Hosts & Raids"] = mapDataForTopic("Hosts & Raids", dates, count, splittedData);
			case "Minutes Watched":
				mappedData["Minutes Watched"] = mapDataForTopic(topic, dates, count, splittedData);
			case "Unique Viewers":
				mappedData["Unique Viewers"] = mapDataForTopic(topic, dates, count, splittedData);
			}

			count++;
		}

		mappedData["Organic Viewers"] = mapOrganicViewersData(mappedData["Average Viewers"], mappedData["Hosts & Raids"]);
		mappedData["Minutes Per Viewer"] = mapMinutesPerViewerData(mappedData["Minutes Watched"], mappedData["Unique Viewers"]);

		return mappedData;
	}
}

function mapDataForTopic(topic, dates, topicCount, data) {
	let topicData = getData(topic);

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
	let organicViewersData = getData("Organic Viewers");

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
	let minutesPerViewerData = getData("Minutes Per Viewer");

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