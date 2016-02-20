#!/usr/bin/env node

var Logger = require('./src/module/Logger.js');
var path = require('path');

var PolyUtil = {
    COMMAND_PATH: 'src/command/',
    init: function() {
        this.checkCommand();
    },
    checkCommand: function() {
        if (process.argv.length > 2) {
            var commandName = this.getCommandName(process.argv[2]);
            var Command = this.getCommand(commandName);
            if (Command) this.execute(Command);
        }
    },
    execute: function(Command) {
        Command.execute({
            projectFolder: process.cwd(),
            options: process.argv.splice(0,2)
        });
    },
    getCommand: function(commandName) {
        var Command;
        try {
            Command = require(path.join(__dirname, this.COMMAND_PATH + commandName + 'Command.js'));
        } catch (e) {
            console.log(e);
            Logger.warn(process.argv[2] + ' command not found');
        }
        return Command;
    },
    getCommandName: function(name) {
        name = name.toLowerCase();
        name = name[0].toUpperCase() + name.substring(1);
        return name;
    }
};

PolyUtil.init();