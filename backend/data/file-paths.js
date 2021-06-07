import { app } from 'electron';
import path from 'path';

const appDataPath = app.getPath("appData");
const userDataPath = appDataPath + path.sep + "Stream Analytics";
const streamDataPath = userDataPath + path.sep + "data";

export default {
	folders: {
		appData: appDataPath,
		userData: userDataPath,
		streamData: streamDataPath
	},
	files: {
		"Settings": path.join(userDataPath, '/settings.json'),
		"Average Viewers": path.join(streamDataPath, '/average-viewers.json'),
		"Organic Viewers": path.join(streamDataPath, '/organic-average-viewers.json'),
		"Hosts & Raids": path.join(streamDataPath, '/hosts-and-raids.json')
	}
}