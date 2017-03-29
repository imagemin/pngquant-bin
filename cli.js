#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const pngquant = require('.');

const input = process.argv.slice(2);

spawn(pngquant, input, {stdio: 'inherit'})
	.on('exit', process.exit);
