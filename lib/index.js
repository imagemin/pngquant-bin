'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');
const http = require('http');

const host = "raw.githubusercontent.com";
const options = {
  hostname: host,
  port: 443
};

const url = `https://${host}/imagemin/pngquant-bin/v${pkg.version}/vendor/`;
const bin = new BinWrapper().dest(path.resolve(__dirname, '../vendor')).use(process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');
const failed = "connection failed";

module.exports = { run: (cmd)=> new Promise((resolve, reject)=>{
		http.get(options).setTimeout(3000, ()=>reject(failed));
			http.end();
			http.once('response', (response)=> {
				response.statusCode >= 200 && response.statusCode <= 299 ? resolve(bin
					.src(`${url}macos/pngquant`, 'darwin')
					.src(`${url}linux/x86/pngquant`, 'linux', 'x86')
					.src(`${url}linux/x64/pngquant`, 'linux', 'x64')
					.src(`${url}freebsd/x64/pngquant`, 'freebsd', 'x64')
					.src(`${url}win/pngquant.exe`, 'win32').run(cmd)): reject(failed);
			});
		})
};
