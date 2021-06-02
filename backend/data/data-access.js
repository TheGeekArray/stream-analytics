import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from './file-paths';
import dataProcesser from './data-processer';

export default {
	async setupFolders() {
		if (!fs.pathExistsSync(filePaths.folders.userData)) {
			fs.mkdirSync(filePaths.folders.userData);

			if (!fs.pathExistsSync(filePaths.folders.streamData)) {
				fs.mkdirSync(filePaths.folders.streamData);
			}
		}
	},
	async setupFiles() {
		await setupFile(filePaths.files.settings);
		await setupFile(filePaths.files.streamData);
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
			let data = readFileSync(filePaths.files.streamData);
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

async function setupFile(filePath) {
	fs.open(filePath, 'ax', function(err, fd) {
		if (err) return;
		fs.writeFileSync(filePath, JSON.stringify({}, null, 4));
	});
}

function readFileSync(path) {
	return fs.readFileSync(path, 'utf8');
}

function writeToDataFile(event, data) {
	fs.writeFile(filePaths.files.streamData, JSON.stringify(data, null, 4), function() {
		event.reply("dataProcessed", data);
	});
}

function writeToSettingsFile(event, settings) {
	fs.writeFile(filePaths.files.settings, JSON.stringify(settings, null, 4), function() {
		event.reply("settingsUpdated");
	});
}