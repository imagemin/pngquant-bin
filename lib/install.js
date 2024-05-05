import process from 'node:process';
import {fileURLToPath} from 'node:url';
import binBuild from 'bin-build';
import bin from './index.js';

try {
	await bin.run(['--version']);
	console.log('pngquant pre-build test passed successfully');
} catch (error) {
	console.warn(error.message);
	console.warn('pngquant pre-build test failed');
	console.info('compiling from source');

	try {
		const source = fileURLToPath(new URL('../vendor/source/pngquant.tar.gz', import.meta.url));

		await binBuild.file(source, [
			'rm ./INSTALL',
			`./configure --prefix="${bin.dest()}"`,
			`make install BINPREFIX="${bin.dest()}"`,
		]);

		console.log('pngquant built successfully');
	} catch (error) {
		console.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
}
