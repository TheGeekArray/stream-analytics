import dataAccess from './data/data-access';
import logger from '../backend/utils/logger';

export default {
	initialize() {
		dataAccess.setupFolders();
		dataAccess.setupFiles();
		dataAccess.setupListeners();

		logger.success(`Initialization finished!`)
	}
}