require('shelljs/global');
var path = require('path');

var Command = {
	execute: function (config) {
		cd(path.dirname(require.main.filename));
		exec('grunt release -projectFolder=' + config.projectFolder );
	}
};
module.exports = Command;