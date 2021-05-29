import fs from 'fs-extra';
import filePaths from './file-paths';
import dataAccess from './data-access';

function setupFolderStructure() {
	const filePath = filePaths.userData.data;
	
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