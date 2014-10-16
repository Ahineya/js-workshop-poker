module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/server/**/*.js']
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mask: 'server/**/*.tests.js'
                }
            }
        },
        jshint: {
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "test/**/*.js"
            ], options: {
                jshintrc: '.jshintrc'
            }
        },
        less: {
            development: {
                files: {
                    "public/css/style.css": "src/client/less/main.less"
                }
            }
        },
        clean: {
            src: ['public']
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/client/images/**/*.*'],
                        dest: 'public/img',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/polymer/polymer.js', 'bower_components/polymer/polymer.js.map'],
                        dest: 'public/vendor/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/platform/platform.js', 'bower_components/platform/platform.js.map'],
                        dest: 'public/vendor/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/domwork/dist/domwork.js'],
                        dest: 'public/vendor/'
                    }

                ]
            },
            js: {
                files: [
                    {expand: true, cwd: 'src/client/js', src: ['**'], dest: 'public/js'},
                    {expand: true, cwd: 'src/common', src: ['constants.js'], dest: 'public/js'}
                ]
            },
            ejs: {files:[{expand: true, cwd: 'src/client/', src: ['**/*.ejs'], dest: 'public/'}]},
            polymer: {
                files: [{expand: true, cwd: 'src/client/polymer-components', src: ['**'], dest: 'public/components/'}]
            }

        },
        watch: {
            common: {
                files: ['src/common/constants.js'],
                tasks: ['jshint', 'karma','copy:js'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            scripts: {
                files: ['src/client/**/*.js'],
                tasks: ['jshint', 'karma','copy:js'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            less: {
                files: ['src/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            css: {
                files: ['public/css/**/*.css'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            polymer: {
                files: ["src/client/polymer-components/**/*"],
                tasks: ['copy:polymer'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            views: {
                files: ["src/client/**/*.ejs"],
                tasks: ['copy:ejs'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            tests: {
                files: ["test/client/**/*.js"],
                tasks: ['jshint', 'karma'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            serverTests: {
                files: ['src/server/**/*.js', "test/server/**/*.js"],
                tasks: ['jshint', 'mochaTest']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'public'
                }
            }
        },
        concurrent: {
            dev: ["build", "nodemon", "watch"],
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: 'src/server/poker.js',
                options: {
                    env: {
                        "NODE_ENV": "development",
                        "NODE_CONFIG": "dev"
                    },
                    watch: ["server"],
                    delay: 300,

                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        nodemon.on('config:update', function () {
                            setTimeout(function() {
                                require('open')('http://local.foo.com:8080');
                            }, 1000);
                        });

                        nodemon.on('restart', function () {
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-mocha-istanbul");

    grunt.registerTask('test', ['jshint', 'mochaTest', 'karma']);
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['clean','less', 'copy']);
    grunt.registerTask('develop-front', ['clean','less', 'copy', 'connect', 'watch']);
    grunt.registerTask('develop', ['concurrent']);

    grunt.registerTask('heroku:development', 'build');
    grunt.registerTask('heroku:production', 'build');
    grunt.registerTask('heroku:', 'build');

};