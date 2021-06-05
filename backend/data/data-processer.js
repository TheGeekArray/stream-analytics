import Logger from '../utils/logger';
import filePaths from './file-paths';
import { readFileSync } from './data-access';

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

		const averageViewersData = processedData["Average Viewers"];
		const hostsAndRaidsData = processedData["Hosts and Raids"];
		const { organicViewersData, artificialViewersData } = splitAverageViewersData(averageViewersData.data, hostsAndRaidsData.data);

		processedData["Organic Average Viewers"] = {
			path: filePaths.files.organicAverageViewers,
			data: organicViewersData
		};

		processedData["Artificial Average Viewers"] = {
			path: filePaths.files.artificialAverageViewers,
			data: artificialViewersData
		};

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
	const organicViewersData = JSON.parse(readFileSync(filePaths.files.organicAverageViewers));
	const artificialViewersData = JSON.parse(readFileSync(filePaths.files.artificialAverageViewers));

	for (let year in averageViewersData) {
		console.log(year);
		if (!organicViewersData.hasOwnProperty(year)) {
			organicViewersData[year] = {};
		}

		if (!artificialViewersData.hasOwnProperty(year)) {
			artificialViewersData[year] = {};
		}

		for (let month in averageViewersData[year]) {
			if (!organicViewersData.hasOwnProperty(month)) {
				organicViewersData[year][month] = {};
			}
	
			if (!artificialViewersData.hasOwnProperty(month)) {
				artificialViewersData[year][month] = {};
			}

			for (let day in averageViewersData[year][month]) {
				let averageViewers = averageViewersData[year][month][day];
				let hostsAndRaids = hostsAndRaidsData[year][month][day];

				if (averageViewers === 0) {
					organicViewersData[year][month][day] = 0;
					artificialViewersData[year][month][day] = 0;
					continue;
				}

				if (hostsAndRaids === 0) {
					organicViewersData[year][month][day] = averageViewers;
					artificialViewersData[year][month][day] = 0;
					continue;
				}

				let percentage = (100 - hostsAndRaids) / 100;
				let organicAverage = averageViewers * percentage;
				let artificialAverage = averageViewers - organicAverage;
		
				organicViewersData[year][month][day] = organicAverage;
				artificialViewersData[year][month][day] = artificialAverage;
			}
		}
	}

	return { organicViewersData, artificialViewersData };
}