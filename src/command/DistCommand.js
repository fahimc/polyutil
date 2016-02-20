require('shelljs/global');
var path = require('path');

var Command = {
	execute: function (config) {
		cd(path.dirname(require.main.filename));
		exec('grunt dist -projectFolder=' + config.projectFolder );
	}
};
module.exports = Command;