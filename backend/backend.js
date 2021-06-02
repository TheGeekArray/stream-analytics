import dataAccess from './data/data-access';

export default {
	async initialize() {
		await dataAccess.setupFolders();
		await dataAccess.setupFiles();
		
		dataAccess.setupListeners();
	}
}