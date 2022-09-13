/**
 * Determine the URL to fetch binary file from.
 * By default fetch from the pngquant-bin distribution
 * site on GitHub.
 *
 * The default URL can be overridden using
 * the environment variable PNGQUANT_BIN_BINARY_SITE,
 * .npmrc variable pngquant_bin_binary_site or
 *
 * The URL should to the mirror of the repository
 * laid out as follows:
 *
 * PNGQUANT_BIN_BINARY_SITE/
 *
 *  vX.X.X
 *  vX.X.X/macos/pngquant
 *
 * @example `https://raw.githubusercontent.com/imagemin/pngquant-bin/v${pkg.version}/vendor/`;
 */
module.exports = function getBinaryUrl(version, pgkConfig = {}) {
	if (!version) {
		return ''
	}

  let site = process.env.PNGQUANT_BIN_BINARY_SITE  ||
		process.env.npm_config_pngquant_bin_binary_site ||
		(pgkConfig.pngquantBinConfig && pgkConfig.pngquantBinConfig.binarySite) ||
	'https://raw.githubusercontent.com/imagemin/pngquant-bin';

	if (site[site.length - 1] === '/') {
		site = site.slice(0, -1)
	}

  return `${site}/v${version}/vendor/`
}
