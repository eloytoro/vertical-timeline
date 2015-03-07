var gulp = require('gulp'),
    merge = require('merge-stream'),
    filesort = require('gulp-angular-filesort'),
    concat = require('gulp-concat'),
    annotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    templateCache = require('gulp-angular-templatecache');

var globs = {
    templates: 'assets/templates/*.html',
    js: 'assets/js/*.js',
    scss: 'assets/styles/*.scss',
    main: 'dist/'
};

gulp.task('sass', function () {
    gulp.src(globs.scss)
        .pipe(sass())
        .pipe(gulp.dest(globs.main));
});

gulp.task('mv', function () {
    gulp.src(globs.scss)
        .pipe(gulp.dest(globs.main));
})

gulp.task('build', ['mv'], function () {
    var templates = gulp.src(globs.templates)
        .pipe(templateCache({
            module: 'vertical-timeline',
            root: 'vertical-timeline/templates'
        }));
    var js = gulp.src(globs.js);
    merge(templates, js)
        .pipe(filesort())
        .pipe(annotate())
        .pipe(concat('vertical-timeline.js'))
        .pipe(gulp.dest(globs.main))
        .pipe(uglify())
        .pipe(rename('vertical-timeline.min.js'))
        .pipe(gulp.dest(globs.main));
});
