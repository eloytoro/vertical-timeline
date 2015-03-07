var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    reload = browserSync.reload,
    cssmin = require('gulp-cssmin'),
    annotate = require('gulp-ng-annotate'),
    usemin = require('gulp-usemin'),
    bower = require('gulp-bower'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    wiredep = require('wiredep').stream;

var globs = {
    styles: 'app/styles/**/*.scss',
    html: 'app/**/*.html',
    js: 'app/scripts/**/*.js',
    assets: [
        './app/fonts/**/*',
        './app/images/**/*',
        './app/views/**/*'
    ]
};

gulp.task('sass', function () {
    return gulp.src(globs.styles)
        .pipe(sass())
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('bower', function () {
    return bower({ cwd: '../' })
        .pipe(gulp.dest('app/bower_components'));
});

gulp.task('inject', ['bower'], function () {
    return gulp.src('app/index.html')
        .pipe(wiredep({
            cwd: '../'
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('serve', ['sass', 'inject'], function () {
    browserSync({
        server: {
            baseDir: 'app',
            routes: {
                '/vertical-timeline': '../assets'
            }
        },
        port: 5000,
        ui: {
            port: 5001
        }
    });

    gulp.watch(globs.styles, ['sass']);
    gulp.watch([globs.html, globs.js])
        .on('change', reload);
});
