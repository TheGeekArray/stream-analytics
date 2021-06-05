import {setupFolders, setupFiles, setupListeners } from './data/data-access';
import logger from '../backend/utils/logger';

export default {
	initialize() {
		setupFolders();
		setupFiles();
		setupListeners();

		logger.success(`Initialization finished!`);
	}
}