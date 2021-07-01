"use strict";

import * as dataAccess from '../data/data-access';
import * as fileHandler from '../utils/file-handler';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import logger from '../utils/logger';
import * as dataMapper from '../data/data-mapper';

export default async function setupUserData() {
	setupFolders();
	setupFiles().then(setupCustomData);
}

function setupFolders() {
	logger.info("Creating missing folders...");
	if (!fs.pathExistsSync(filePaths.folders.userData)) {
		fs.mkdirSync(filePaths.folders.userData);
		logger.info("Creating user data folder...");
	}

	if (!fs.pathExistsSync(filePaths.folders.streamData)) {
		fs.mkdirSync(filePaths.folders.streamData);
		logger.info("Creating stream data folder...");
	}

	if (!fs.pathExistsSync(filePaths.folders.uploadedFiles)) {
		fs.mkdirSync(filePaths.folders.uploadedFiles);
		logger.info("Creating uploaded files folder...");
	}
}

async function setupFiles() {
	logger.info("Creating missing files...");
	try {
		await dataAccess.loadDataFromStorage();
	} catch (err) {
		logger.error(err);
	}
}

function setupCustomData() {
	const loadedData = dataAccess.getAllLoadedData();

	if (!loadedData || Object.keys(loadedData).length === 0) {
		logger.error("No custom data found");
		return;
	}

	const customData = dataMapper.mapCustomData(loadedData);

	for (let key of Object.keys(customData)) {
		fileHandler.writeToFile(key, customData[key]);
	}
}