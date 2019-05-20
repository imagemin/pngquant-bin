'use strict';
const log = require('logalot');
const bin = require('.');

bin.run(['--version']).then(() => {
	log.success('pngquant pre-build test passed successfully');
}).catch(err => {
	log.warn(err.message);
	log.warn('pngquant pre-build test failed');
	process.exit(1);
});
