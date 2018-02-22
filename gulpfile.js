var gulp = require('gulp');
var del = require('del');
var cleanSketch = require('gulp-clean-sketch');
var svgmin = require('gulp-svgmin');
var raster = require('gulp-raster');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watchScss = gulp.watch('site/assets/scss/*', ['sass']);

gulp.task('processIcons', function() {
  return gulp.src('dist/icons/svg/*.svg')
    // Clean Sketch Meta
    .pipe(cleanSketch())
    // Minimise SVG
    .pipe(svgmin())
    .pipe(gulp.dest('dist/icons/svg/'))
    // Convert to .PNG
    .pipe(raster())
    .pipe(rename({extname : '.png'}))
    // Optimise PNG
    .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
    .pipe(gulp.dest('dist/icons/png'));
});

gulp.task('sass', function(){
  return gulp.src('site/assets/scss/*')
    .pipe(sass({outputStyle : 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('site/assets/css'));
});

watchScss.on('change', function(event){
  console.log('Compiling Css...');
});

gulp.task('clean', function(){
  return del(['**/.DS_Store']);
});

gulp.task('default');
