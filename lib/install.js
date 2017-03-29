'use strict';
const BinBuild = require('bin-build');
const logalot = require('logalot');
const bin = require('.');

bin.run(['--version'], err => {
	if (err) {
		logalot.warn(err.message);
		logalot.warn('pngquant pre-build test failed');
		logalot.info('compiling from source');

		const libpng = process.platform === 'darwin' ? 'libpng' : 'libpng-dev';
		const builder = new BinBuild()
			.src('https://github.com/pornel/pngquant/archive/2.7.1.tar.gz')
			.cmd('rm ./INSTALL')
			.cmd(`./configure --prefix="${bin.dest()}"`)
			.cmd(`make install BINPREFIX="${bin.dest()}"`);

		return builder.run(err => {
			if (err) {
				err.message = `pngquant failed to build, make sure that ${libpng} is installed`;
				logalot.error(err.stack);
				return;
			}

			logalot.success('pngquant built successfully');
		});
	}

	logalot.success('pngquant pre-build test passed successfully');
});
