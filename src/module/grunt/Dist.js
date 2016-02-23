var grunt;

var Release = {
	config:{
		directory: null,
        destination: null
	},
    init: function(_grunt) {
        grunt = _grunt;
        this.config.directory = grunt.option('projectFolder');
        this.config.destination = grunt.option('destination');
        this.loadNPMTasks(grunt);
        this.registerTasks(grunt);
    },
    loadNPMTasks: function () {
    	grunt.loadNpmTasks('grunt-replace');
         grunt.loadNpmTasks('grunt-shell-spawn');
    },
    getConfig: function() {
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
                        dest: this.config.destination ? this.config.destination : this.config.directory + '/Release'
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
module.exports = Release;