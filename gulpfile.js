'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('app/scripts/app.js')
        .pipe($.browserify({
            insertGlobals: true,
            transform: ['reactify']
        }))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// Images
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size())
        .pipe($.connect.reload());
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
        read: false
    }).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

// Connect
gulp.task('connect', function() {
    $.connect.server({
        root: ['dist'],
        port: 9000,
        livereload: true
    });
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*', {
        base: 'app/bower_components'
    })
    .pipe(gulp.dest('dist/bower_components/'));
});

// Watch
gulp.task('watch', ['html', 'bundle', 'connect'], function() {

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch .jade files
    gulp.watch('app/template/**/*.jade', ['jade', 'html']);

    // Watch .coffeescript files
    gulp.watch('app/scripts/**/*.coffee', ['coffee', 'scripts']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
