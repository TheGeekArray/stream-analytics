export default {
	processData(data) {
		const splittedData = splitData(data);
	
		const labels = splittedData.shift().filter(label => label !== "Date");
		const { dates, strippedData } = shiftDates(splittedData);
	},	
	mapData(data) {
		const splittedData = splitData(data);
		const topics = splittedData.shift();
		const twitchData = {};
	
		let count = 0;
		for (let topic of topics) {
			twitchData[topic] = [];
	
			for (let line of splittedData) {
				twitchData[topic].push(line[count]);
			}
	
			count++;
		}
	
		return twitchData;
	}
}

function shiftDates(data) {
	const dates = [];

	for (let row of data) {
		dates.push(row.shift());	
	}

	return { dates: dates, strippedData: data };
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