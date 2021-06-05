"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from './file-paths';
import dataProcesser from './data-processer';
import logger from '../utils/logger';

let setupFolders = function() {
	logger.info("Creating missing folders...");
	if (!fs.pathExistsSync(filePaths.folders.userData)) {
		fs.mkdirSync(filePaths.folders.userData);
		logger.info("Creating user data folder...");

		if (!fs.pathExistsSync(filePaths.folders.streamData)) {
			fs.mkdirSync(filePaths.folders.streamData);
			logger.info("Creating stream data folder...");
		}
	}
}

let setupFiles = function() {
	logger.info("Creating missing files...");
	for (let file in filePaths.files) {
		setupFile(file, filePaths.files[file]);
	}
}

let setupListeners = function() {
	ipcMain.on("fileUploaded", function(event, data) {
		logger.info(`Processing uploaded file...`);
		let processedData = dataProcesser.processData(data);

		if (processedData) {
			for (let topic in processedData) {
				writeToDataFile(topic, processedData[topic]);
			}

			event.reply("dataProcessed");
		}
	});

	ipcMain.on("dataRequested", function(event, topic) {
		let data = {};

		if (topic === "Average Viewers") {
			data.organicViewers = JSON.parse(readFileSync(filePaths.files.organicAverageViewers));
			data.artificialViewers = JSON.parse(readFileSync(filePaths.files.artificialAverageViewers));
		}
		
		if (data) {
			event.reply("dataLoaded", data);
			logger.success(`Data loaded`);
		}
	});

	ipcMain.on("startingDateSet", function(event, date) {
		logger.info(`Setting starting date...`);
		let settings = { startingDate: date };
		writeToSettingsFile(event, settings);
	});
}

let readFileSync = function(path) {
	return fs.readFileSync(path, 'utf8');
}


function setupFile(file, filePath) {
	try {
		fs.writeFileSync(filePath, JSON.stringify({}), { encoding: "utf8", flag: "wx", mode: 0o666 });
		logger.info(`Created ${file} file...`);
	} catch (err) {
		return;
	}
}

function writeToDataFile(topic, topicData) {
	fs.writeFile(topicData.path, JSON.stringify(topicData.data, null, 4), function() {
		logger.debug(`Processed ${topic} data`);
	});
}

function writeToSettingsFile(event, settings) {
	fs.writeFile(filePaths.files.settings, JSON.stringify(settings, null, 4), function() {
		event.reply("settingsUpdated");
		logger.success(`Updated settings`);
	});
}
export { setupFolders, setupFiles, setupListeners, readFileSync };