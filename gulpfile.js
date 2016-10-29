'use strict';

var gulp = require('gulp');
var config = require('./gulp.config');

// plugins
var gulpUtil = require('gulp-util');
var nunjucksRender = require('gulp-nunjucks-render');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var del = require('del');

gulp.task('default', ['start-project']);

gulp.task('start-project', function () {
    logMessage('Start project with nodemon');

    var options = {
        script: config.server,
        env: {
            'PORT': process.env.PORT || config.defaultPort,
            'NODE_ENV': 'dev'
        },
        watch: [config.serverJS]
    };

    return nodemon(options)
        .on('restart', function (ev) {
            logMessage('nodemon restarted');
            logMessage('changed files \n' + ev);
        });

})

gulp.task('clean-markup', function () {
    logMessage('Cleaning markup');

    var files = config.markupDestFolder + '/*.html';
    del(files);
});

gulp.task('check-js', function () {
    logMessage('Execute jshint');

    return gulp.src(config.projectJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

function logMessage(message) {
    gulpUtil.log(gulpUtil.colors.blue(message));
}