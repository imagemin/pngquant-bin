/*global afterEach,beforeEach,it*/
'use strict';

var assert = require('assert');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');
var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var compareSize = require('compare-size');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = path.join(__dirname, 'tmp');

beforeEach(function () {
	mkdirp.sync(tmp);
});

afterEach(function () {
	rimraf.sync(tmp);
});

it('rebuild the pngquant binaries', function (cb) {
	new BinBuild()
		.src('https://github.com/pornel/pngquant/archive/2.5.0.tar.gz')
		.cmd('make install BINPREFIX="' + tmp + '"')
		.run(function (err) {
			assert(!err);
			assert(fs.statSync(path.join(tmp, 'pngquant')).isFile());
			cb();
		});
});

it('return path to binary and verify that it is working', function (cb) {
	binCheck(require('../'), ['--version'], function (err, works) {
		assert(!err);
		assert(works);
		cb();
	});
});

it('minify a PNG', function (cb) {
	var src = path.join(__dirname, 'fixtures/test.png');
	var dest = path.join(tmp, 'test.png');
	var args = [
		'-o', dest,
		src
	];

	execFile(require('../'), args, function (err) {
		assert(!err);

		compareSize(src, dest, function (err, res) {
			assert(!err);
			assert(res[dest] < res[src]);
			cb();
		});
	});
});
