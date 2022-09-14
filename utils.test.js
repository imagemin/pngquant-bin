const assert = require('assert')
const getBinaryUrl = require('./utils')

function main() {
	const version = '1.1.1'
	const site =  'https://a.b.c/folder'
	const pkg = {
		pngquantBinConfig: {
			binarySite: site,
		},
	}
	const pkg2 = {
		pngquantBinConfig: {
			binarySite: `${site}/`,
		},
	}


	assert(getBinaryUrl(version) ===
	`https://raw.githubusercontent.com/imagemin/pngquant-bin/v${version}/vendor/`, 'fail1')
	assert(getBinaryUrl(version, pkg) ===  `https://a.b.c/folder/v${version}/vendor/`, 'fail2')
	assert(getBinaryUrl(version, pkg2) ===  `https://a.b.c/folder/v${version}/vendor/`, 'fail2')

	// test PNGQUANT_BIN_BINARY_SITE
	const cacheEnv = { ...process.env }
	process.env.PNGQUANT_BIN_BINARY_SITE = site
	assert(getBinaryUrl(version) ===  `https://a.b.c/folder/v${version}/vendor/`, 'fail2')
	process.env = { ...cacheEnv }

	// test .npmrc npm_config_pngquant_bin_binary_site
	process.env.npm_config_pngquant_bin_binary_site = site
	assert(getBinaryUrl(version) ===  `https://a.b.c/folder/v${version}/vendor/`, 'fail2')
	process.env = { ...cacheEnv }
}

main()
