/*global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var rm = require('rimraf');

describe('pngquant()', function () {
	afterEach(function (cb) {
		rm(path.join(__dirname, 'tmp'), cb);
	});

	beforeEach(function () {
		fs.mkdirSync(path.join(__dirname, 'tmp'));
	});

	it('should rebuild the pngquant binaries', function (cb) {
		var tmp = path.join(__dirname, 'tmp');
		var builder = new BinBuild()
			.src('https://github.com/pornel/pngquant/archive/2.3.0.tar.gz')
			.cmd('chmod +x configure')
			.cmd('make install BINPREFIX="' + tmp + '"');

		builder.build(function (err) {
			assert(!err);
			assert(fs.existsSync(path.join(tmp, 'pngquant')));
			cb();
		});
	});

	it('should return path to binary and verify that it is working', function (cb) {
		var binPath = require('../').path;

		binCheck(binPath, ['--version'], function (err, works) {
			assert(!err);
			assert.equal(works, true);
			cb();
		});
	});

	it('should minify a PNG', function (cb) {
		var binPath = require('../').path;
		var args = [
			'-o', path.join(__dirname, 'tmp/test.png'),
			path.join(__dirname, 'fixtures', 'test.png')
		];

		execFile(binPath, args, function (err) {
			var src = fs.statSync(path.join(__dirname, 'fixtures/test.png')).size;
			var dest = fs.statSync(path.join(__dirname, 'tmp/test.png')).size;

			assert(!err);
			assert(dest < src);
			cb();
		});
	});
});
