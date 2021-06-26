"use strict";

import * as dataAccess from '../data/data-access';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import logger from './logger';

export async function readFile(file, filePath) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			logger.error(err);
		} else {
			if (data) {
				dataAccess.setLoadedData(file, JSON.parse(data));
			}
		}
	});
}

export async function writeToFile(topic, topicData) {
	dataAccess.setLoadedData(topic, topicData);

	try {
		fs.writeFile(filePaths.files[topic], JSON.stringify(topicData, null, 4), function(err) {
			if (err) {
				logger.error(`[writeToFile]`, err);
			} else {
				logger.debug(`Processed ${topic} data`);
			}
		});
	} catch (err) {
		logger.error(`[writeToFile]` + err, true);
	}
}