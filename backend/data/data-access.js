"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from './file-paths';
import dataMapper from './data-mapper';
import organicViewersProcesser from './data-processers/organic-viewers-processer';
import minutesPerViewerProcesser from './data-processers/minutes-per-viewer-processer';
import logger from '../utils/logger';

let loadedData = {};

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
	ipcMain.on("fileUploaded", async function(event, data) {
		logger.info(`Processing uploaded file...`);
		
		dataMapper.mapData(data).then(mappedData => {
			for (let topic in mappedData) {
				writeToFile(topic, mappedData[topic]).then(() => {
					event.reply("dataProcessed");
				});
			}
		});
	});

	ipcMain.on("dataRequested", function(event, timeUnit, range, topic) {
		let processedData = {};

		switch (topic) {
		case "Organic Viewers":
			processedData = organicViewersProcesser.getGroupedData(timeUnit, range, loadedData[topic]);
			break;
		case "Minutes Per Viewer":
			processedData = minutesPerViewerProcesser.getGroupedData(timeUnit, range, loadedData[topic]);
			break;
		default:
			return;
		}

		event.reply("dataLoaded", processedData);
	});

	ipcMain.on("startingDateSet", function(date) {
		logger.info(`Setting starting date...`);
		let settings = { startingDate: date };
		writeToFile("Settings", settings);
	});
}

let getData = function(topic) {
	return loadedData[topic];
};

async function setupFile(file, filePath) {
	try {
		fs.writeFileSync(filePath, JSON.stringify({}), { encoding: "utf8", flag: "wx", mode: 0o666 });
		loadedData[file] = {};
		logger.info(`Created ${file} file...`);
	} catch (err) {
		logger.debug(`[setupFile]` + err);
		await readFile(file, filePath);
	}
}

async function readFile(file, filePath) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			logger.error(err);
		} else {
			if (data) {
				loadedData[file] = JSON.parse(data);
			}
		}
	});
}

async function writeToFile(topic, topicData) {
	loadedData[topic] = topicData;

	try {
		fs.writeFile(filePaths.files[topic], JSON.stringify(topicData, null, 4), function(err) {
			if (err) {
				logger.error(`[writeToFile]`, err);
			} else {
				logger.debug(`Processed ${topic} data`);
			}
		});
	} catch (err) {
		logger.error(`[writeFile]` + err, true);
	}
	
}

export { setupFolders, setupFiles, setupListeners, getData };