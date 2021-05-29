import { app } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import dataAccess from './data-access';

function setupFolderStructure() {
	const userDataPath = app.getPath("appData") + path.sep + "Stream Analytics";
	const filePath = userDataPath + path.sep + "data";
	
	if (!fs.pathExists(filePath)) {
		fs.mkdirSync(filePath);
	}
}

export default {
	initializeData: function() {
		dataAccess.setupListeners();
		setupFolderStructure();
	}
}