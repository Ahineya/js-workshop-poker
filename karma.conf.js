module.exports = function(config) {
    config.set({
        basePath: 'src',
        frameworks: ['jasmine', 'sinon'],
        files: [
            '../test/socket.io.js',
            'client/**/*.js',
            '../test/client/**/*.js'
        ],
        preprocessors: {
            'client/**/*.js': 'coverage'
        },
        coverageReporter: {
            type : 'html',
            dir : '../coverage/'
        },
        exclude: [
        ],
        reporters: ['spec', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};