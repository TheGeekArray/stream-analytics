import dataAccess from './data/data-access';

export default {
	initialize: function() {
		dataAccess.setupFolderStructure();
		dataAccess.setupListeners();
	}
}