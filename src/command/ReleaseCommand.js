require('shelljs/global');
var path = require('path');

var Command = {
	execute: function (config) {
		console.log('release');
		cd(path.dirname(require.main.filename));
		exec('grunt release -projectFolder=' + config.projectFolder );
	}
};
module.exports = Command;