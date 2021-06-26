"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import dataMapper from './data-mapper';
import organicViewersProcesser from './data-processers/organic-viewers-processer';
import minutesPerViewerProcesser from './data-processers/minutes-per-viewer-processer';
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
		fileHandler.writeToFile("Settings", settings);
	});
}

export function getData(topic) {
	return loadedData[topic];
};

export function setLoadedData(file, data) {
	loadedData[file] = data;
}