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
		settings: path.join(userDataPath, '/settings.json'),
		data: path.join(streamDataPath, '/data.json'),
		averageViewers: path.join(streamDataPath, '/average-viewers.json'),
		hostsAndRaids: path.join(streamDataPath, '/hosts-and-raids.json')
	}
}