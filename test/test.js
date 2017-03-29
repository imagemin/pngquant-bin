'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const BinBuild = require('bin-build');
const compareSize = require('compare-size');
const pngquant = require('..');

test.cb('rebuild the pngquant binaries', t => {
	const tmp = tempy.directory();

	new BinBuild()
		.src('https://github.com/pornel/pngquant/archive/2.7.1.tar.gz')
		.cmd('rm ./INSTALL')
		.cmd(`./configure --prefix="${tmp}"`)
		.cmd(`make install BINPREFIX="${tmp}"`)
		.run(err => {
			t.ifError(err);
			t.true(fs.existsSync(path.join(tmp, 'pngquant')));
			t.end();
		});
});

test('return path to binary and verify that it is working', async t => {
	t.true(await binCheck(pngquant, ['--version']));
});

test('minify a PNG', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(tmp, 'test.png');
	const args = [
		'-o', dest,
		src
	];

	await execa(pngquant, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
