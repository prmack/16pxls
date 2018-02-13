var gulp = require('gulp');
var cleanSketch = require('gulp-clean-sketch');
var clean = require('gulp-clean-fix');

gulp.task('cleanSketch', function() {
  return gulp.src('img/svg/*.svg')
    .pipe(cleanSketch())
    .pipe(gulp.dest('img/svg/'));
});

gulp.task('clean', function() {
  return gulp.src('*/.DS_Store', {read : false})
    .pipe(clean());
});

gulp.task('default');
