/*global describe, it */
'use strict';

var assert = require('assert');
var Bin = require('bin-wrapper');
var fs = require('fs');
var options = require('../lib/pngquant').options;
var path = require('path');

describe('pngquant.build()', function () {
	it('should rebuild the pngquant binaries', function (cb) {
		this.timeout(false);
		var bin = new Bin(options);

		bin.path = path.join(__dirname, '../tmp', bin.bin);
		bin.buildScript = 'make install BINPREFIX=' + path.join(__dirname, '../tmp');

		bin.build(function () {
			var origCTime = fs.statSync(bin.path).ctime;
			var actualCTime = fs.statSync(bin.path).ctime;

			assert(actualCTime !== origCTime);
			cb();
		});
	});
});
