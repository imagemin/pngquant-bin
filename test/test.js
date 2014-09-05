'use strict';

var binCheck = require('bin-check');
var BinBuild = require('bin-build');
var execFile = require('child_process').execFile;
var fs = require('fs');
var mkdir = require('mkdirp');
var path = require('path');
var rm = require('rimraf');
var test = require('ava');
var tmp = path.join(__dirname, 'tmp');

test('rebuild the pngquant binaries', function (t) {
	t.plan(3);

	var builder = new BinBuild()
		.src('https://github.com/pornel/pngquant/archive/2.3.0.tar.gz')
		.cmd('make install BINPREFIX="' + tmp + '"');

	builder.build(function (err) {
		t.assert(!err);

		fs.exists(path.join(tmp, 'pngquant'), function (exists) {
			t.assert(exists);

			rm(tmp, function (err) {
				t.assert(!err);
			});
		});
	});
});

test('return path to binary and verify that it is working', function (t) {
	t.plan(2);

	binCheck(require('../').path, ['--version'], function (err, works) {
		t.assert(!err);
		t.assert(works);
	});
});

test('minify a PNG', function (t) {
	t.plan(6);

	var args = [
		'-o', path.join(tmp, 'test.png'),
		path.join(__dirname, 'fixtures/test.png')
	];

	mkdir(tmp, function (err) {
		t.assert(!err);

		execFile(require('../').path, args, function (err) {
			t.assert(!err);

			fs.stat(path.join(__dirname, 'fixtures/test.png'), function (err, a) {
				t.assert(!err);

				fs.stat(path.join(tmp, 'test.png'), function (err, b) {
					t.assert(!err);
					t.assert(b.size < a.size);

					rm(tmp, function (err) {
						t.assert(!err);
					});
				});
			});
		});
	});
});
