'use strict';
const path = require('path');
const log = require('logalot');
const binBuild = require('bin-build');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://raw.githubusercontent.com/imagemin/pngquant-bin/v${pkg.version}/vendor/`;
const dest = path.resolve(__dirname, '../vendor');

module.exports = (() => {
	const libpng = process.platform === 'darwin' ? 'libpng' : 'libpng-dev';

	binBuild.file(path.resolve(__dirname, '../vendor/source/pngquant.tar.gz'), [
		'rm ./INSTALL',
		`./configure --prefix="${dest}"`,
		`make install BINPREFIX="${dest}"`
		]).then(() => {
		log.success('pngquant built successfully');
	}).catch(err => {
		err.message = `pngquant failed to build, make sure that ${libpng} is installed`;
		log.error(err.stack);
	});

	return new BinWrapper()
		.src(`${url}macos/pngquant`, 'darwin')
		.src(`${url}linux/x86/pngquant`, 'linux', 'x86')
		.src(`${url}linux/x64/pngquant`, 'linux', 'x64')
		.src(`${url}freebsd/x64/pngquant`, 'freebsd', 'x64')
		.src(`${url}win/pngquant.exe`, 'win32')
		.dest(dest)
		.use(process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');
})();
