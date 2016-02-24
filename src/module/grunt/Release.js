var grunt;

var Release = {
  config: {
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
  loadNPMTasks: function() {
    grunt.loadNpmTasks('grunt-replace');
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
            dest: this.config.directory
          }]
        }
      },
      shell: {
        getReleaseBranch: {
          command: 'git checkout release',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        pullReleaseBranch: {
          command: 'git pull origin release',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        getMasterBranch: {
          command: 'git checkout master',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        mergeReleaseBranch: {
          command: 'git merge -s ours --no-commit release',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        commitMasterBranch: {
          command: 'git commit -m "merged release"',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        pushMasterBranch: {
          command: 'git push origin master',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        mergeMasterBranch: {
          command: 'git merge master',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        fetchTags: {
          command: 'git fetch --tags origin release',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        getLatestTag: {
          command: 'git describe --tags --abbrev=0',
          options: {
            execOptions: {
              cwd: this.config.directory
            },
            callback: function(exitCode, stdOutStr, stdErrStr, done) {
              if (stdErrStr) {
                grunt.log.warn("No current Tags found");
                grunt.option("versionNumber", "v1.0.0");
                grunt.log.ok("New Tag created v1.0.0");
              } else {
                grunt.option("versionNumber", stdOutStr);
                grunt.log.writeln("Tags found");
                Release.bumpVersionNumber();
              }
              done();
            }
          }
        },
        createReleaseTag: {
          command: "git tag -a <%= grunt.option(\"versionNumber\") %> -m \"Release <%= grunt.option(\"versionNumber\") %>\"",
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        commitReleaseBranch: {
          command: 'git add -A && git commit -m "Merged release version <%= grunt.option(\"versionNumber\") %>"',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        pushReleaseTag: {
          command: 'git push origin release <%= grunt.option(\"versionNumber\") %>',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        pushReleaseBranch: {
          command: 'git push origin release',
          options: {
            execOptions: {
              cwd: this.config.directory
            }
          }
        },
        deleteLocalTag: {
          command: 'git tag -d <%= grunt.option(\"versionNumber\") %>',
          options: {
            execOptions: {
              cwd: this.config.directory
            },
            callback: function(exitCode, stdOutStr, stdErrStr, done) {
              grunt.log.warn(stdOutStr);
              done();
            }
          }
        }
      }
    }
  },
  customTasks: {
    force: function(set) {
      if (set === "on") {
        grunt.option("force", true);
      } else if (set === "off") {
        grunt.option("force", false);
      }
    },
    checkReplace: function() {
      if (!grunt.option("dont-replace")) {
        console.log('replacing bower_components');
        grunt.task.run('replace:bower');
      }else{
        console.log('not replacing bower_components');
      }
    },
    updatePackageJson: function() {
      var done = this.async();
      var project = grunt.option('projectFolder') || './';
      if (grunt.file.exists(project + '/package.json')) {
        var packageJson = grunt.file.readJSON(project + '/package.json');
        packageJson['version'] = grunt.option("versionNumber");
        grunt.file.write(project + '/package.json', JSON.stringify(packageJson, null, 2));
        grunt.task.run('shell:commitReleaseBranch');
        grunt.task.run('shell:pushReleaseBranch');
        done();
      } else {
        done();
      }
    },
  },
  bumpVersionNumber: function() {
    var type = "patch";
    if (grunt.option("minor")) {
      type = "minor";
    } else if (grunt.option("major")) {
      type = "major";
    }
    var arr = grunt.option("versionNumber").split(".");
    switch (type) {
      case 'minor':
      arr[1] = Number(arr[1]) + 1;
      arr[2] = "0";
      break;
      case 'patch':
      arr[2] = Number(arr[2]) + 1;
      break;
      case 'major':
      arr[0] = "v" + String(Number(arr[0].replace("v", "")) + 1);
      arr[1] = "0";
      arr[2] = "0";
      break;
    }
    grunt.option("versionNumber", arr.join("."));
    grunt.log.ok("New tag created " + arr.join("."));
  },
  registerTasks: function() {
    for (var key in this.customTasks) {
      grunt.registerTask(key, this.customTasks[key])
    }
    grunt.registerTask('pullMergeRelease', ['shell:getReleaseBranch', 'shell:pullReleaseBranch', 'shell:getMasterBranch', 'shell:mergeReleaseBranch', 'force:on', 'shell:commitMasterBranch', 'force:off', 'shell:pushMasterBranch', 'shell:getReleaseBranch', 'shell:mergeMasterBranch']);

    grunt.registerTask('releaseCommit', ['force:on', 'shell:commitReleaseBranch', 'force:off']);

    grunt.registerTask('tagPush', ['shell:fetchTags', 'force:on', 'shell:getLatestTag', 'updatePackageJson', 'shell:deleteLocalTag', 'force:off', 'shell:createReleaseTag', 'shell:pushReleaseBranch', 'shell:pushReleaseTag']);


        //register standard tasks
        grunt.registerTask('release', ['pullMergeRelease', 'checkReplace', 'releaseCommit', 'tagPush', 'shell:getMasterBranch']);
      }
    };
    module.exports = Release;