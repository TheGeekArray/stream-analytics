"use strict";

import * as dataAccess from '../data/data-access';
import * as fileHandler from '../utils/file-handler';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import logger from '../utils/logger';

export default function setupUserData() {
	setupFolders();
	setupFiles();
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

function setupFiles() {
	logger.info("Creating missing files...");
	for (let file in filePaths.files) {
		setupFile(file, filePaths.files[file]);
	}
}

async function setupFile(file, filePath) {
	try {
		fs.writeFileSync(filePath, JSON.stringify({}), { encoding: "utf8", flag: "wx", mode: 0o666 });
		dataAccess.setLoadedData(file, {});
		logger.info(`Created ${file} file...`);
	} catch (err) {
		logger.debug(`[setupFile]` + err);
		await fileHandler.readFile(file, filePath);
	}
}