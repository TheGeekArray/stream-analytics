"use strict";

import setupUserData from './initialization/userdata-setup';
import * as dataAccess from './data/data-access';
import logger from './utils/logger';

export default function initialize() {
	setupUserData();
	dataAccess.setupListeners();

	logger.success(`Initialization finished!`);
}