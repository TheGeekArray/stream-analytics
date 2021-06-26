"use strict";

// https://en.wikipedia.org/wiki/ANSI_escape_code

export default class Logger {
	static info(message) {
		const infoLabel = '\x1b[30;104m SA INFO \x1b[0m';
		console.info(infoLabel, `${message}`);
	}

	static success(message) {
		const infoLabel = '\x1b[30;102m SA SUCCESS \x1b[0m';
		console.info(infoLabel, `${message}`);
	}

	static error(message, trace = false) {
		const infoLabel = '\x1b[30;101m SA ERROR \x1b[0m';

		console.error(infoLabel, `${message}`);
		
		if(trace) {
			console.trace();
		}
	}

	static debug(message, trace = false) {
		const infoLabel = '\x1b[30;45m SA DEBUG \x1b[0m';

		console.info(infoLabel, `${message}`);

		if(trace) {
			console.trace();
		}
	}
}