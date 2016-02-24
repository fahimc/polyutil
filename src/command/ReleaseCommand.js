require('shelljs/global');
var path = require('path');

var Command = {
	execute: function (config) {
		var args = (config.options !== undefined) ? config.options.join(' ') : '';
		cd(path.dirname(require.main.filename));
		exec('grunt release -projectFolder=' + config.projectFolder ' ' + args);
	}
};
module.exports = Command;