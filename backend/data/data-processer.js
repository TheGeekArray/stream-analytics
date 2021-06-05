import Logger from '../utils/logger';
import filePaths from './file-paths';
import { readFileSync } from './data-access';

// calculateOrganicAverage: function(averageViewers, hostsAndRaids) {
// 	const organicAverage = [];

// 	for (let i = 0; i < averageViewers.length; i++) {
// 		let average = (1 - (hostsAndRaids[i] / 100)) * averageViewers[i];
// 		organicAverage.push(average);
// 	}

// 	return organicAverage;
// },
// calculateArticifialAverage: function(averageViewers, organicAverage) {
// 	const artificialAverage = [];

// 	for (let i = 0; i < averageViewers.length; i++) {
// 		let average = averageViewers[i] - organicAverage[i];
// 		artificialAverage.push(average);
// 	}

// 	return artificialAverage;
// }

export default {
	processData(data) {
		const splittedData = splitData(data);
		const topics = splittedData.shift();
		const dates = getDates(splittedData);
		let processedData = {};

		let count = 0;
		let path = "";
		for (let topic of topics) {
			switch (topic) {
			case "Average Viewers":
				path = filePaths.files.averageViewers;
				processedData["Average Viewers"] = {
					path: path,
					data: mapData(path, dates, count, splittedData)
				}
			case "Hosts and Raids Viewers (%)":
				path = filePaths.files.hostsAndRaids;
				processedData["Hosts and Raids"] = {
					path: path,
					data: mapData(path, dates, count, splittedData)
				}
			}

			count++;
		}

		return processedData;
	}
}

function mapData(path, dates, topicCount, data) {
	const topicData = JSON.parse(readFileSync(path));

	let count = 0;
	for (let line of data) {
		let date = getSplittedDate(dates[count]);

		if (!topicData.hasOwnProperty(date.year)) {
			topicData[date.year] = {};
		}
		if (!topicData[date.year].hasOwnProperty(date.month)) {
			topicData[date.year][date.month] = {};
		}

		topicData[date.year][date.month][date.dayName + " " + date.dayDate] = line[topicCount];

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