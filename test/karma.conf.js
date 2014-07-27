module.exports = function (config) {
    config.set({
        basePath: '..',

        frameworks: [ 'jasmine', 'requirejs' ],

        files: [ /* definition in gruntfile */ ],

        reporters: [ 'dots' ],
        colors: true,
        logLevel: config.LOG_INFO,
        
        port: 9876,
        autoWatch: false,
        background: true,

        browsers: [ 'PhantomJS' ],
        singleRun: true
    });
};