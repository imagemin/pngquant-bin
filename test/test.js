/*global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('assert');
var binCheck = require('bin-check');
var BinWrapper = require('bin-wrapper');
var fs = require('fs');
var path = require('path');
var rm = require('rimraf');
var spawn = require('child_process').spawn;

describe('pngquant()', function () {
    afterEach(function (cb) {
        rm(path.join(__dirname, 'tmp'), cb);
    });

    beforeEach(function (cb) {
        fs.mkdir(path.join(__dirname, 'tmp'), cb);
    });

    it('should rebuild the pngquant binaries', function (cb) {
        var bin = new BinWrapper({ bin: 'pngquant', dest: path.join(__dirname, 'tmp') });
        var bs = 'make install BINPREFIX="' + bin.dest + '"';

        bin
            .addSource('https://github.com/pornel/pngquant/archive/2.1.0.tar.gz')
            .build(bs)
            .on('finish', function () {
                cb(assert(true));
            });
    });

    it('should return path to binary and verify that it is working', function (cb) {
        var binPath = require('../').path;

        binCheck(binPath, '--version', function (err, works) {
            cb(assert.equal(works, true));
        });
    });

    it('should minify a PNG', function (cb) {
        var binPath = require('../').path;
        var args = [
            path.join(__dirname, 'fixtures/test.png')
        ];

        spawn(binPath, args).on('close', function () {
            var src = fs.statSync(path.join(__dirname, 'fixtures/test.png')).size;
            var dest = fs.statSync(path.join(__dirname, 'fixtures/test-fs8.png')).size;

            assert(dest < src);
            rm(path.join(__dirname, 'fixtures/test-fs8.png'), cb);
        });
    });
});
