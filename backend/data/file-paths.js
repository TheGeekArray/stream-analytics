import { app } from 'electron';
import path from 'path';

const appDataPath = app.getPath("appData");
const userDataPath = app.getPath("appData") + path.sep + "Stream Analytics";
const DATA_FILES_PATH = "data";

export default {
	appData: appDataPath,
	userData: {
		root: userDataPath,
		data: userDataPath + path.sep + DATA_FILES_PATH
	}
}