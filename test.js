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
	const temporary = tempy.directory();

	await binBuild.file(path.resolve(__dirname, 'vendor/source/pngquant.tar.gz'), [
		'rm ./INSTALL',
		`./configure --prefix="${temporary}"`,
		`make install BINPREFIX="${temporary}"`
	]);

	t.true(fs.existsSync(path.join(temporary, 'pngquant')));
});

test('verify binary', async t => {
	t.true(await binCheck(m, ['--version']));
});

test('minify a png', async t => {
	const temporary = tempy.directory();
	const src = path.join(__dirname, 'fixtures/test.png');
	const dest = path.join(temporary, 'test.png');
	const args = [
		'-o',
		dest,
		src
	];

	await execa(m, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
