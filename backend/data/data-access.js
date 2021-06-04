import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from './file-paths';
import dataProcesser from './data-processer';
import logger from '../utils/logger';

export default {
	setupFolders() {
		logger.info("Creating missing folders...");
		if (!fs.pathExistsSync(filePaths.folders.userData)) {
			fs.mkdirSync(filePaths.folders.userData);
			logger.info("Creating user data folder...");

			if (!fs.pathExistsSync(filePaths.folders.streamData)) {
				fs.mkdirSync(filePaths.folders.streamData);
				logger.info("Creating stream data folder...");
			}
		}
	},
	async setupFiles() {
		logger.info("Creating missing files...");
		for (let file in filePaths.files) {
			setupFile(file, filePaths.files[file]);
		}
	},
	setupListeners() {
		ipcMain.on("fileUploaded", function(event, data) {
			logger.info(`Processing uploaded file...`);
			const mappedData = dataProcesser.mapData(data);
			dataProcesser.processData(data);
			
			if (mappedData) {
				writeToDataFile(event, mappedData);
			}
		});
	
		ipcMain.on("dataRequested", function(event) {
			let data = readFileSync(filePaths.files.data);
			if (data) {
				event.reply("dataLoaded", JSON.parse(data));
				logger.success(`Data loaded`);
			}
		});

		ipcMain.on("startingDateSet", function(event, date) {
			logger.info(`Setting starting date...`);
			let settings = { startingDate: date };
			writeToSettingsFile(event, settings);
		});
	}
}

function setupFile(file, filePath) {
	fs.open(filePath, 'ax', function(err, fd) {
		if (err) return;
		fs.writeFileSync(filePath, JSON.stringify({}, null, 4));
		logger.info(`Created ${file} file...`);
	});
}

function readFileSync(path) {
	return fs.readFileSync(path, 'utf8');
}

function writeToDataFile(event, data) {
	fs.writeFile(filePaths.files.data, JSON.stringify(data, null, 4), function() {
		event.reply("dataProcessed", data);
		logger.success(`Processed data`);
	});
}

function writeToSettingsFile(event, settings) {
	fs.writeFile(filePaths.files.settings, JSON.stringify(settings, null, 4), function() {
		event.reply("settingsUpdated");
		logger.success(`Updated settings`);
	});
}