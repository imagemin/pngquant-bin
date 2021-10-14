# pngquant-bin ![GitHub Actions Status](https://github.com/imagemin/pngquant-bin/workflows/test/badge.svg?branch=master)

> [`pngquant`](https://github.com/kornelski/pngquant) is a PNG compressor that significantly reduces file sizes by converting images to a more efficient 8-bit PNG format

You probably want [`imagemin-pngquant`](https://github.com/imagemin/imagemin-pngquant) instead.


## Install

```
$ npm install pngquant-bin
```

If you wish to pull through your own internal mirror you can use `GITHUB_RAW_URL`
to point the postinstall step to pull through your mirror. By default, this package
attempts to install from `https://raw.githubusercontent.com` on postinstall, and compiles
otherwise if the connection can't be made.

## Usage

```js
const {execFile} = require('child_process');
const pngquant = require('pngquant-bin');

execFile(pngquant, ['-o', 'output.png', 'input.png'], err => {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global pngquant-bin
```

```
$ pngquant --help
```


## Updating pre-compiled binaries

The Linux binaries are statically linked so they should work on all Linux distributions. To recompile them:

1. `sudo apt-get install libpng-dev`
2. `./configure CFLAGS=-static && make && cp pngquant pngquant-64`
3. Repeat the above commands, but in a 32-bin docker container started with: docker run -ti -v `pwd`:/source i386/debian:9.3 bash
