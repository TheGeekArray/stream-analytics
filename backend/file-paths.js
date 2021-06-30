"use strict";

import { app } from 'electron';
import path from 'path';

const appDataPath = app.getPath("appData");
const userDataPath = appDataPath + path.sep + "Stream Analytics";
const streamDataPath = userDataPath + path.sep + "data";
const uploadedFilesPath = userDataPath + path.sep + "uploaded";

export default {
	folders: {
		appData: appDataPath,
		userData: userDataPath,
		streamData: streamDataPath,
		uploadedFiles: uploadedFilesPath
	},
	files: {
		"Settings": path.join(userDataPath, '/settings.json'),
		"Ad Breaks (Minutes)": path.join(streamDataPath, '/ad-breaks.json'),
		"Ad Time (Seconds) Per Hour": path.join(streamDataPath, '/ad-time-per-hour.json'),
		"Average Viewers": path.join(streamDataPath, '/average-viewers.json'),
		"Chat Messages": path.join(streamDataPath, '/chat-messages.json'),
		"Chatters": path.join(streamDataPath, '/chatters.json'),
		"Clip Views": path.join(streamDataPath, '/clip-views.json'),
		"Clips Created": path.join(streamDataPath, '/clip-created.json'),
		"Follows": path.join(streamDataPath, '/follows.json'),
		"Hosts & Raids": path.join(streamDataPath, '/hosts-and-raids.json'),
		"Live Views": path.join(streamDataPath, '/live-views.json'),
		"Max Viewers": path.join(streamDataPath, '/max-viewers.json'),
		"Minutes Watched": path.join(streamDataPath, '/minutes-watched.json'),
		"Minutes Streamed": path.join(streamDataPath, '/minutes-streamed.json'),
		"Unique Viewers": path.join(streamDataPath, '/unique-viewers.json'),
		"Sub Revenue": path.join(streamDataPath, '/sub-revenue.json'),
		"Prime Revenue": path.join(streamDataPath, '/prime-revenue.json'),
		"Gifted Subs Revenue": path.join(streamDataPath, '/gifted-subs-revenue.json'),
		"Bits Revenue": path.join(streamDataPath, '/bits-revenue.json'),
		"Ad Revenue": path.join(streamDataPath, '/ad-revenue.json'),
		"Game Sales Revenue": path.join(streamDataPath, '/game-sales-revenue.json'),
		"Extensions Revenue": path.join(streamDataPath, '/extensions-revenue.json'),
		"Bounties Revenue": path.join(streamDataPath, '/bounties-revenue.json'),
		"Prime Subs": path.join(streamDataPath, '/prime-subs.json'),
		"Total Paid Subs": path.join(streamDataPath, '/total-paid-subs.json'),
		"Tier 1 subs": path.join(streamDataPath, '/tier-1-subs.json'),
		"Tier 2 subs": path.join(streamDataPath, '/tier-2-subs.json'),
		"Tier 3 subs": path.join(streamDataPath, '/tier-3-subs.json'),
		"Total Gifted Subs": path.join(streamDataPath, '/total-gifted-subs.json'),
		"Gifted Tier 1 subs": path.join(streamDataPath, '/gifted-tier-1-subs.json'),
		"Organic Viewers": path.join(streamDataPath, '/organic-average-viewers.json'),
		"Artificial Viewers": path.join(streamDataPath, '/artificial-average-viewers.json'),
		"Minutes Per Viewer": path.join(streamDataPath, '/minutes-per-viewer.json'),
		"Lurkers": path.join(streamDataPath, '/lurkers.json')
		
	}
}