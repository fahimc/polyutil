var path = require('path');

var Main = {
  config: {
    modulesPath: "src/module/grunt/"
  },
  modules: [
    "Dist",
    "Release"
  ],
  gruntConfig: {},
  init: function (grunt) {
    this.loadModules(grunt);
  },
  loadModules: function (grunt) {
    for (var a = 0; a < this.modules.length; a++) {
      var module = require(path.join(__dirname, this.config.modulesPath + this.modules[a] + ".js"));
      module.init(grunt);
      var initconfig = module.getConfig();
      this.addToInitConfig(initconfig);
    }
    this.setInitConfig(grunt);
  },
  addToInitConfig: function (config) {
    for (var key in config) {
      //check if key exists in initConfig
      if (this.gruntConfig[key]) {
      		//has key
      		for(var subKey in config[key]){
      			this.gruntConfig[key][subKey] = config[key][subKey];
      		}
      }else{
      		//not in initConfig
      		this.gruntConfig[key] = config[key];
      }
    }
  },
  setInitConfig:function(grunt){
  	 grunt.initConfig(this.gruntConfig);
  }
}

module.exports = Main.init.bind(Main);