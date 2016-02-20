var express = require('express');
var open = require('open');
var net = require('net');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var app = express();

var Server = {
  config:{
    serverPort: 8999,
    directory: ''
  },
  init: function (config) {
    this.config.directory = config.projectFolder;
    this.setup();
    this.findFreePort();
  },
  setup: function () {
    app.use(express.compress());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use(express.directory(this.config.directory));
    app.use(express.static(this.config.directory));
  },
  getPortNumber: function () {
    return this.config.serverPort += 100;
  },
  findFreePort: function () {
    var server = net.createServer(function (socket) {
      socket.write('Echo server\r\n');
      socket.pipe(socket);
    });

    server.listen(this.getPortNumber());
    server.on('error', function (e) {
      console.log(e);
      Server.findFreePort();
    });
    server.on('listening', function (e) {
      server.close();
      Server.start(false);
    });
  },
  start: function () {
    app.listen(this.config.serverPort);
    console.log('server listening at %s', this.config.serverPort);
    open('http://localhost:' + this.config.serverPort);
  }
};
module.exports = Server;