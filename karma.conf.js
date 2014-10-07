module.exports = function(config) {
    config.set({
        basePath: 'src',
        frameworks: ['detectBrowsers', 'jasmine', 'jasmine-matchers', 'sinon'],
        files: [
            '../bower_components/platform/platform.js',
            '../bower_components/polymer/polymer.js',
            '../test/socket.io.js',
            '../test/jasmine-config.js',
            'common/constants.js',
            'client/**/*.js',
            'client/polymer-components/**/*.html',
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
        browsers: ['Firefox'],
        plugins: [
            'karma-jasmine-matchers',
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