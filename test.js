import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import execa from 'execa';
import tempy from 'tempy';
import binCheck from 'bin-check';
import binBuild from 'bin-build';
import compareSize from 'compare-size';
import pngquant from './index.js';

test('rebuild the pngquant binaries', async t => {
	// Skip the test on Windows
	if (process.platform === 'win32') {
		t.pass();
		return;
	}

	const temporary = tempy.directory();
	const source = fileURLToPath(new URL('./vendor/source/pngquant.tar.gz', import.meta.url));

	await binBuild.file(source, [
		'rm ./INSTALL',
		`./configure --prefix="${temporary}"`,
		`make install BINPREFIX="${temporary}"`,
	]);

	t.true(fs.existsSync(path.join(temporary, 'pngquant')));
});

test('verify binary', async t => {
	t.true(await binCheck(pngquant, ['--version']));
});

test('minify a png', async t => {
	const temporary = tempy.directory();
	const src = fileURLToPath(new URL('./fixtures/test.png', import.meta.url));
	const dest = path.join(temporary, 'test.png');
	const args = [
		'-o',
		dest,
		src,
	];

	await execa(pngquant, args);
	const result = await compareSize(src, dest);

	t.true(result[dest] < result[src]);
});
