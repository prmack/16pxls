var gulp = require('gulp');
var del = require('del');
var clean = require('gulp-clean');
var cleanSketch = require('gulp-clean-sketch');
var svgmin = require('gulp-svgmin');
var raster = require('gulp-raster');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');

gulp.task('processIcons', function() {
  return gulp.src('dist/svg/*.svg')
    // Clean Sketch Meta
    .pipe(cleanSketch())
    // Minimise SVG
    .pipe(svgmin())
    .pipe(gulp.dest('dist/svg/'))
    // Convert to .PNG
    .pipe(raster())
    .pipe(rename({extname : '.png'}))
    // Optimise PNG
    .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
    .pipe(gulp.dest('dist/png/'));
});

gulp.task('clean', function(){
  return del(['**/.DS_Store']);
});


gulp.task('default');
