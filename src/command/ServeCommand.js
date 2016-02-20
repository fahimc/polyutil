var Server = require('../module/Server.js');

var Command = {
	execute: function (config) {
		Server.init(config);
	}
};

module.exports = Command;