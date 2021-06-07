import Logger from '../utils/logger';
import filePaths from './file-paths';
import { getData } from './data-access';

export default {
	async processData(data) {
		const splittedData = splitData(data);
		const topics = splittedData.shift();
		const dates = getDates(splittedData);
		let processedData = {};

		let count = 0;
		for (let topic of topics) {
			switch (topic) {
			case "Average Viewers":
				processedData["Average Viewers"] = mapData(topic, dates, count, splittedData);
			case "Hosts and Raids Viewers (%)":
				let newTopic = "Hosts & Raids";
				processedData[newTopic] = mapData(newTopic, dates, count, splittedData);
			}

			count++;
		}

		const averageViewersData = processedData["Average Viewers"];
		const hostsAndRaidsData = processedData["Hosts & Raids"];
		const organicViewersData = splitAverageViewersData(averageViewersData, hostsAndRaidsData);

		processedData["Organic Viewers"] = organicViewersData;

		return processedData;
	}
}

function mapData(topic, dates, topicCount, data) {
	let topicData = getData(topic);

	if (topicData == null) return;

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

function getDates(data) {
	const dates = [];

	for (let row of data) {
		dates.push(row[0]);
	}

	return dates;
}

function getSplittedDate(date) {
	let splittedDate = {
		year: "",
		dayDate: "",
		month: "",
		dayName: ""
	};

	let dateArray = date.split(" ");

	let count = 3;
	for (let timeUnit in splittedDate) {
		splittedDate[timeUnit] = dateArray[count];
		count--;
	}

	return splittedDate;
}

function splitData(data) {
	const dataToSplit = data.split("\n");
	const splittedData = [];

	for (let line of dataToSplit) {
		let splittedLine = line.split(",");
		splittedData.push(splittedLine);
	}

	return splittedData;
}

function splitAverageViewersData(averageViewersData, hostsAndRaidsData) {
	let organicViewersData = getData("Organic Viewers");

	if (organicViewersData == null) {
		Logger.error("No data for splitAverageViewersData");
		return;
	}

	for (let year in averageViewersData) {
		if (!organicViewersData.hasOwnProperty(year)) {
			organicViewersData[year] = {};
		}

		for (let month in averageViewersData[year]) {
			if (!organicViewersData.hasOwnProperty(month)) {
				organicViewersData[year][month] = {};
			}

			for (let day in averageViewersData[year][month]) {
				if (!organicViewersData.hasOwnProperty(day)) {
					organicViewersData[year][month][day] = {};
				}

				let averageViewers = parseFloat(averageViewersData[year][month][day]);
				let hostsAndRaids = parseFloat(hostsAndRaidsData[year][month][day]);

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

				let percentage = (100 - hostsAndRaids) / 100;
				let organicAverage = averageViewers * percentage;
				let artificialAverage = averageViewers - organicAverage;
		
				organicViewersData[year][month][day]["organic"] = organicAverage;
				organicViewersData[year][month][day]["artificial"] = artificialAverage;
			}
		}
	}

	return organicViewersData;
}