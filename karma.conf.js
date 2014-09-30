module.exports = function(config) {
    config.set({
        basePath: 'src',
        frameworks: ['detectBrowsers', 'jasmine', 'sinon'],
        files: [
            '../bower_components/platform/platform.js',
            '../bower_components/polymer/polymer.js',
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
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-sinon',
            'karma-detect-browsers',
            'karma-coverage'
            
        ],
        detectBrowsers: {
            enabled: true,
            usePhantomJS: false
        },
        captureTimeout: 60000,
        singleRun: true
    });
};