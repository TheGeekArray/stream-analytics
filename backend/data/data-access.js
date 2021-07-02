"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import * as dataMapper from './data-mapper';
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

			for (let topic in result.allData) {
				if (topic === "Date") {
					continue;
				}

				fileHandler.writeToFile(topic, result.allData[topic]).then(() => {
					event.reply("dataProcessed");
				});
			}
		});
	});

	ipcMain.on("dataRequested", function(event, topics, displayAverage = true, range = { start: "", end: "" }, timeUnit = "Day") {
		let labels = [];
		let formattedData = [];

		for (let topic of topics) {
			let data = dataFormatter.formatData(timeUnit, range, loadedData[topic], displayAverage);
			formattedData.push(data.formattedData);
			labels = data.labels;
		}

		event.reply("dataLoaded", formattedData, labels);
	});
}

export async function loadDataFromStorage() {
	for (let file in filePaths.files) {
		try {
			let data = await fileHandler.readFileFromStorage(file);
			loadedData[file] = JSON.parse(data);
		} catch (err) {
			logger.error(`[loadDataFromStorage]` + err, true);
			fileHandler.createNewFile(file);
		}
	}
}

export function getLoadedData(topic) {;
	return loadedData[topic];
};

export function getAllLoadedData() {
	return loadedData;
};

export function setLoadedData(file, data) {
	loadedData[file] = data;
}