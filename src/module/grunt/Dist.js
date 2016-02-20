var grunt;

var Dist = {
	config:{
		directory: ''
	},
    init: function(_grunt) {
        grunt = _grunt;
        this.config.directory = grunt.option('projectFolder');
        this.loadNPMTasks(grunt);
        this.registerTasks(grunt);
    },
    loadNPMTasks: function () {
    	grunt.loadNpmTasks('grunt-replace');
        console.log('task');
    },
    getConfig: function() {
        console.log(this.config.directory);
        return {
            replace: {
                bower: {
                    options: {
                        patterns: [{
                            match: /bower_components/g,
                            replacement: '..'
                        }]
                    },
                    files: [{
                        cwd: this.config.directory,
                        expand: true,
                        src: ['**/*.{html,xhtml,htm,js,css}', '!bower_components/**', '!**/node_modules/**', '!**/lib/**', '!**/Gruntfile.js'],
                        dest: this.config.directory + '/Dist'
                    }]
                }
            }
        };
    },
    customTasks: {

    },
    registerTasks: function () {
        console.log('register');
    	grunt.registerTask('dist',['replace']); 
    }
};
module.exports = Dist;