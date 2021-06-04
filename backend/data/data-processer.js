import filePaths from './file-paths';

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
		for (let topic of topics) {
			switch (topic) {
			case "Average Viewers":
				processedData["Average Viewers"] = {
					path: filePaths.files.averageViewers,
					data: mapData(dates, count, splittedData)
				}
			case "Hosts and Raids Viewers (%)":
				processedData["Hosts and Raids"] = {
					path: filePaths.files.hostsAndRaids,
					data: mapData(dates, count, splittedData)
				}
			}

			count++;
		}

		return processedData;
	}
}

function mapData(dates, topicCount, data) {
	const topicData = {};

	let count = 0;
	for (let line of data) {
		topicData[dates[count]] = line[topicCount];
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

function splitData(data) {
	const dataToSplit = data.split("\n");
	const splittedData = [];

	for (let line of dataToSplit) {
		let splittedLine = line.split(",");
		splittedData.push(splittedLine);
	}

	return splittedData;
}