module.exports = function (grunt) {

    grunt.registerTask('default', [ 'dev' ]);

    grunt.registerTask('dev', [
        'jshint',
        'clean:dist',
        'clean:bower',
        'build:dev',
        'http-server:dev',
        'watch:demo'
    ]);

    grunt.registerTask('dist', [
        'jshint',
        'clean:dist',
        'clean:bower',
        'build:dist'
    ]);

    grunt.registerTask('demo', [
        'dist',
        'http-server:demo'
    ]);

    grunt.registerTask('test', [
        'dist',
        'karma:unit',
        'watch:test'
    ]);

    grunt.registerMultiTask('build', simpleMultiTaskRunner);
    grunt.registerMultiTask('styles', simpleMultiTaskRunner);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            demo: {
                dir: 'demo',
                files: 'demo/**'
            },
            dist: 'dist',
            src: {
                js: {
                    dir: 'src/scripts',
                    files: 'src/scripts/**/*.js',
                    build: 'src/app.build.js',
                    main: 'src/scripts/main.js'
                }
            },
            spec: {
                main: 'test/main.js',
                files: 'src/scripts/**/*.spec.js'
            },
            styles: {
                dir: 'src/styles',
                files: 'src/styles/**/*.css'
            }
        },
        clean: {
            dist: [ '<%= config.dist %>/*' ],
            bower: 'bower_components',
            styles: [
                '<%= config.dist %>/**/*.css',
                '!<%= config.dist %>/<%= pkg.name %>.css'
            ]
        },
        build: {
            dev: [
                'bower-install-simple:dev',
                'copy:all',
                'concat:requirejs-config',
                'styles:dev'
            ],
            dist: [
                'bower-install-simple:dist',
                'requirejs:all',
                'uglify:dist',
                'styles:dist'
            ]
        },
        styles: {
            dev: [
                'autoprefixer:dev',
                'concat:styles',
                'clean:styles'
            ],
            dist: [
                'autoprefixer:dist',
                'cssmin:dist',
                'clean:styles'
            ]
        },
        concat: {
            'requirejs-config': {
                options: {
                    banner: '<% return grunt.file.read(config.src.js.build) + \'\\n\\n\'; %>'
                },
                files: [{
                    src: '<%= config.src.js.main %>',
                    dest: '<%= config.dist %>/<%= pkg.name %>.js'
                }]
            },
            styles: {
                options: {
                     process: function(src, filepath) {
                        var filename = /\/([^\/]+$)/.exec(filepath)[1];

                        return [
                            '/* ### ' + filename + ' >> */',
                            src,
                            '/* << ' + filename + ' ### */',
                            '\n'
                        ].join('\n\n');
                    }  
                },
                files: [{
                    src: '<%= config.styles.dir %>/**/*.css',
                    dest: '<%= config.dist %>/<%= pkg.name %>.css'
                }]
            }
        },
        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src.js.dir %>',
                    src: '**',
                    dest: '<%= config.dist %>/scripts'
                }]
            }
        },
        requirejs:{
            all: {
                options: {
                    baseUrl: '<%= config.src.js.dir %>',
                    mainConfigFile: '<%= config.src.js.build %>',
                    out: '<%= config.dist %>/<%= pkg.name %>.js',
                    name: 'main'
                }
            }
        },
        uglify: {
            dist: {
                files: [{
                    src: '<%= config.dist %>/<%= pkg.name %>.js',
                    dest: '<%= config.dist %>/<%= pkg.name %>.js'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: [ 'last 2 version' ]
            },
            dev: {
                options: {
                    cascade: true,
                    map: 'inline'
                },
                expand: true,
                flatten: true,
                src: '<%= config.styles.dir %>/**/*.css',
                dest: '<%= config.dist %>'
            },
            dist: {
                options: {
                    cascade: false,
                    map: false
                },
                expand: true,
                flatten: true,
                src: '<%= config.styles.dir %>/**/*.css',
                dest: '<%= config.dist %>'
            }  
        },
        cssmin: {
            dist: {
                files: [{
                    src: '<%= config.dist %>/*.css',
                    dest: '<%= config.dist %>/<%= pkg.name %>.css'
                }]
            }
        },
        'bower-install-simple': {
            dev: {
                options: {
                    production: false
                }
            },
            dist: {
                options: {
                    production: true
                }
            }
        },
        watch: {
            demo: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= config.src.js.files %>',
                    '<%= config.styles.files %>',
                    '<%= config.demo.files %>'
                ],
                tasks: [ 'jshint', 'build:dev' ]
            },
            test: {
                files: [
                    '<%= config.src.js.files %>',
                    '<%= config.spec.files %>'
                ],
                tasks: [ 'dist', 'karma:unit:run' ]
            }
        },
        jshint: {
            files: [
                'gruntfile.js',
                '<%= config.spec.files %>',
                '<%= config.src.js.files %>'
            ]
        },
        'http-server': {
            dev: {
                root: '.',
                port: 8080,
                host: '127.0.0.1',
                cache: 0,
                showDir : true,
                autoIndex: true,
                defaultExt: 'html',
                runInBackground: true
            },
            demo: {
                root: '.',
                port: 8080,
                host: '127.0.0.1',
                cache: 0,
                showDir : true,
                autoIndex: true,
                defaultExt: 'html',
                runInBackground: false
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'test/karma.conf.js',
                    files: [
                        '<%= config.dist %>/<%= pkg.name %>.js',
                        { pattern: 'bower_components/**/*', included: false },
                        { pattern: 'src/scripts/**/*.spec.js', included: false },
                        'test/main.js'
                    ]
                }
            }
        },
    });

    require('load-grunt-tasks')(grunt);


    function simpleMultiTaskRunner() {
        grunt.task.run(this.data);
    }

};
