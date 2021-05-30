import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import filePaths from './file-paths';
import dataProcesser from './data-processer';

export default {
	setupFolderStructure() {
		const dataFilePath = filePaths.userData.data;
				
		if (!fs.pathExists(dataFilePath)) {
			fs.mkdirSync(dataFilePath);
		}
	},
	setupListeners() {
		ipcMain.on("fileUploaded", function(event, data) {
			const mappedData = dataProcesser.mapData(data);
			dataProcesser.processData(data);
			
			if (mappedData) {
				writeToDataFile(event, mappedData);
			}
		});
	
		ipcMain.on("dataRequested", function(event) {
			let data = readFileSync(path.join(filePaths.userData.data, '/data.json'));
			if (data) {
				event.reply("dataLoaded", JSON.parse(data));
			}
		});

		ipcMain.on("startingDateSet", function(event, date) {
			let settings = { startingDate: date };
			writeToSettingsFile(event, settings);
		});
	}
}

function readFileSync(path) {
	return fs.readFileSync(path, 'utf8');
}

function writeToDataFile(event, data) {
	fs.writeFile(path.join(filePaths.userData.data, '/data.json'), JSON.stringify(data, null, 4), function() {
		event.reply("dataProcessed", data);
	});
}

function writeToSettingsFile(event, settings) {
	fs.writeFile(path.join(filePaths.userData.root, '/settings.json'), JSON.stringify(settings, null, 4), function() {
		event.reply("settingsUpdated");
	});
}