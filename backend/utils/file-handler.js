"use strict";

import * as dataAccess from '../data/data-access';
import fs from 'fs-extra';
import filePaths from '../file-paths';
import logger from './logger';

export async function readFileFromStorage(file) {
	return await fs.readFile(filePaths.files[file], { encoding: 'utf8' });
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

export function createNewFile(file) {
	fs.writeFileSync(filePaths.files[file], JSON.stringify({}), { encoding: "utf8", flag: "wx", mode: 0o666 });
	dataAccess.setLoadedData(file, {});
}