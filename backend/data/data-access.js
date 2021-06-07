"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from './file-paths';
import dataProcesser from './data-processer';
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
		
		dataProcesser.processData(data).then(processedData => {
			for (let topic in processedData) {
				writeToFile(topic, processedData[topic]).then(() => {
					event.reply("dataProcessed");
				});
			}
		});
	});

	ipcMain.on("dataRequested", function(event, topic) {
		event.reply("dataLoaded", loadedData[topic]);
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

function setupFile(file, filePath) {
	try {
		fs.writeFileSync(filePath, JSON.stringify({}), { encoding: "utf8", flag: "wx", mode: 0o666 });
		loadedData[file] = {};
		logger.info(`Created ${file} file...`);
	} catch (err) {
		logger.debug(`[setupFile]` + err);
	}
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