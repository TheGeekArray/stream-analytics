import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import filePaths from './file-paths';

export default {
	setupFolderStructure() {
		const filePath = filePaths.userData.data;
				
		if (!fs.pathExists(filePath)) {
			fs.mkdirSync(filePath);
		}
	},
	setupListeners() {
		ipcMain.on("fileUploaded", function(event, data) {
			const mappedData = mapData(data);
			if (mappedData) {
				dataToWrite = JSON.stringify(mappedData);
				fs.writeFile(path.join(filePaths.userData.data, '/data.json'), dataToWrite, function() {
					event.reply("dataProcessed", mappedData);
				});
			}
		});
	
		ipcMain.on("dataRequested", function(event) {
			let data = fs.readFileSync(path.join(filePaths.userData.data, '/data.json'), 'utf8');
			if (data) {
				event.reply("dataLoaded", JSON.parse(data));
			}
		});
	}
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