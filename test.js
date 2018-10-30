import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';
import tempy from 'tempy';
import binCheck from 'bin-check';
import binBuild from 'bin-build';
import compareSize from 'compare-size';
import m from '.';

test('rebuild the pngquant binaries', async t => {
	const tmp = tempy.directory();

	await binBuild.file(path.resolve(__dirname, 'vendor/source/pngquant.tar.gz'), [
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
		'-o',
		dest,
		src
	];

	await execa(m, args);
	const res = await compareSize(src, dest);

	t.true(res[dest] < res[src]);
});
