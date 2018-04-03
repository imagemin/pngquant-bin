'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const execa = require('execa');
const tempy = require('tempy');
const binCheck = require('bin-check');
const binBuild = require('bin-build');
const compareSize = require('compare-size');
const m = require('.');

test('rebuild the pngquant binaries', async t => {
	const tmp = tempy.directory();

	await binBuild.file(path.resolve(__dirname, 'vendor/src-pngquant/pngquant-2.10.1-src.tar.gz'), [
		'rm ./INSTALL',
		`./configure --prefix="${tmp}"`,
		`make install BINPREFIX="${tmp}"`
	]);

	t.true(fs.existsSync(path.join(tmp, 'pngquant')));
});

test('verify binary', async t => {
	t.true(await binCheck(m, ['--version']));
});

test('minify a png', async t => {
	const tmp = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(tmp, 'test.png');
	const args = [
		'-o', dest,
		src
	];

	await execa(m, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
