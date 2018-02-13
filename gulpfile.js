var gulp = require('gulp');
var cleanSketch = require('gulp-clean-sketch');

gulp.task('icons', function() {
  return gulp.src('img/svg/*.svg')
  .pipe(cleanSketch())
  .pipe(gulp.dest('img/svg/'));
});

gulp.task('default', ['icons']);
