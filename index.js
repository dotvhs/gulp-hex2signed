var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;

var PLUGIN_NAME = "gulp-hex2signed";

function hexToInt(hex) {
	if (hex.length % 2 != 0) {
		hex = "0" + hex;
	}
	var num = parseInt(hex, 16);
	var maxVal = Math.pow(2, (hex.length / 2) * 8);
	if (num > maxVal / 2 - 1) {
		num = num - maxVal;
	}
	return num;
}

var hexint = function(css) {
	return css.replace(/color:?\s#([0-9a-fA-f]{3,8});/g, function(match, $1) {
		var newMatch = match + "android: " + hexToInt($1) + ";";
		return newMatch;
	});
};

function gulpPrefixer() {
	var stream = through.obj(function(file, enc, cb) {
		if (file.isStream()) {
			this.emit(
				"error",
				new PluginError(PLUGIN_NAME, "Streams are not supported!")
			);
			return cb();
		}

		if (file.isBuffer()) {
			file.contents = new Buffer(hexint(file.contents.toString()));
		}

		this.push(file);

		cb();
	});

	return stream;
}

module.exports = gulpPrefixer;
