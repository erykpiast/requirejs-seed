module.exports = function (grunt) {

    grunt.registerTask('default', [ 'dev' ]);
    grunt.registerTask('dev', [ 'jshint', 'build:dev', 'http-server:dev', 'watch:demo' ]);
    grunt.registerTask('dist', [ 'jshint', 'build:dist' ]);
    grunt.registerMultiTask('build', simpleMultiTaskRunner);
    grunt.registerTask('demo', [ 'build:dist', 'http-server:demo' ]);
    grunt.registerTask('test', [ 'build:dist', 'karma:unit', 'watch:test' ]);

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
            }
        },
        clean: {
            dist: [ '<%= config.dist %>/*' ]
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
        build: {
            dev: [ 'clean:dist', 'copy:all', 'concat:requirejs-config' ],
            dist: [ 'clean:dist', 'requirejs:all', 'uglify:release' ]
        },
        concat: {
            'requirejs-config': {
                options: {
                    banner: '<% return grunt.file.read(config.src.js.build) + \'\\n\\n\'; %>'
                },
                files: [{
                    src: '<%= config.src.js.main %>',
                    dest: '<%= config.dist %>/<%= pkg.name %>.js'
                }/*, {
                    src: '<%= config.spec.main %>',
                    dest: '<%= config.dist %>/test.js'
                }*/]
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
            release: {
                src: '<%= config.dist %>/<%= pkg.name %>.js',
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
            }
        },
        watch: {
            demo: {
                options: {
                    livereload: true
                },
                files: [ '<%= config.src.js.files %>', '<%= config.demo.files %>' ],
                tasks: [ 'jshint', 'build:dev' ]
            },
            test: {
                files: [ '<%= config.src.js.files %>', '<%= config.spec.files %>' ],
                tasks: [ 'build:dist', 'karma:unit:run' ]
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
        }
    });

    require('load-grunt-tasks')(grunt);


    function simpleMultiTaskRunner() {
        grunt.task.run(this.data);
    }

};