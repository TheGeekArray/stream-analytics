"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import dataMapper from './data-mapper';
import * as dataFormatter from './data-formatter';
import logger from '../utils/logger';
import path from 'path';
import * as fileHandler from '../utils/file-handler';

let loadedData = {};

export function setupListeners() {
	ipcMain.on("fileUploaded", async function(event, data) {
		logger.info(`Processing uploaded file...`);
		
		dataMapper.mapData(data).then((result) => {
			const uploadedFilePath = path.join(filePaths.folders.uploadedFiles, '/' + result.fileName + '.csv');
			fs.writeFile(uploadedFilePath, data, function() {
				logger.info(`Processed file saved`);
			});

			for (let topic in result.mappedData) {
				if (topic === "Date") {
					continue;
				}

				fileHandler.writeToFile(topic, result.mappedData[topic]).then(() => {
					event.reply("dataProcessed");
				});
			}
		});
	});

	ipcMain.on("dataRequested", function(event, topic, range = { start: "", end: "" }, timeUnit = "Day") {
		let data = dataFormatter.formatData(timeUnit, range, topic, loadedData[topic]);
		event.reply("dataLoaded", data.formattedData, data.labels);
	});

	ipcMain.on("startingDateSet", function(date) {
		logger.info(`Setting starting date...`);
		let settings = { startingDate: date };
		fileHandler.writeToFile("Settings", settings);
	});
}

export function getLoadedData(topic) {
	return loadedData[topic];
};

export function setLoadedData(file, data) {
	loadedData[file] = data;
}