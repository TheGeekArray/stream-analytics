const { app, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');

function setupListeners() {
	ipcMain.on("fileUploaded", function(event, data) {
		const mappedData = mapData(data);
		if (mappedData) {
			dataToWrite = JSON.stringify(mappedData);
			fs.writeFile(path.join(app.getPath("appData") + path.sep + "Stream Analytics" + path.sep + "data", '/data.json'), dataToWrite, function(){
				event.reply("dataProcessed", mappedData);
			});
		}
	});
}

function mapData(data) {
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

function splitData(data) {
	const dataToSplit = data.split("\n");
	const splittedData = [];

	for (let line of dataToSplit) {
		let splittedLine = line.split(",");
		splittedData.push(splittedLine);
	}

	return splittedData;
}

exports.setupListeners = setupListeners;