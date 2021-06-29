"use strict";

import { ipcMain } from 'electron';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import dataMapper from './data-mapper';
import organicViewersProcesser from './data-processers/organic-viewers';
import minutesPerViewerProcesser from './data-processers/minutes-per-viewer';
import lurkersVsChattersProcesser from './data-processers/lurkers-vs-chatters';
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
		let processedData = [];
		let labels = {};

		switch (topic) {
		case "Organic Viewers":
			let averageViewersData = organicViewersProcesser.getGroupedData(timeUnit, range, loadedData[topic]);
			processedData.push(averageViewersData.data.organic);
			processedData.push(averageViewersData.data.artificial);
			labels = averageViewersData.labels;
			break;
		case "Minutes Per Viewer":
			let minutesPerViewerData = minutesPerViewerProcesser.getGroupedData(timeUnit, range, loadedData[topic]);
			processedData.push(minutesPerViewerData.data);
			labels = minutesPerViewerData.labels;
			break;
		case "Lurkers vs. Chatters":
			let lurkersVsChattersData = lurkersVsChattersProcesser.getGroupedData(timeUnit, range, loadedData[topic]);
			processedData.push(lurkersVsChattersData.data.chatters);
			processedData.push(lurkersVsChattersData.data.lurkers);
			labels = lurkersVsChattersData.labels;
			break;
		default:
			return;
		}

		event.reply("dataLoaded", processedData, labels);
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