#!/usr/bin/env node
import process from 'node:process';
import execa from 'execa';
import pngquant from './index.js';

execa(pngquant, process.argv.slice(2), {stdio: 'inherit'});
