var gulp = require('gulp');
var del = require('del');
var cleanSketch = require('gulp-clean-sketch');
var svgmin = require('gulp-svgmin');
var raster = require('gulp-raster');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watchScss = gulp.watch('site/assets/scss/*', ['sass']);

// Clean & Minimise SVG
gulp.task('cleanSVG', function(cb){
  return gulp.src('dist/icons/svg/*.svg')
    .pipe(cleanSketch())
    .pipe(svgmin({js2svg : {pretty : true}}))
    .pipe(gulp.dest('dist/icons/svg/'))
    cb(err);
});

// Create PNG
gulp.task('createPNG', ['cleanSVG'], function(cb) {
  return gulp.src('dist/icons/svg/*.svg')
    .pipe(raster())
    .pipe(rename({extname : '.png'}))
    .pipe(gulp.dest('dist/icons/png/@1x'))
    cb(err);
});

// Scale for Retina
gulp.task('createRetinaPNG', ['cleanSVG'], function(cb){
  return gulp.src('dist/icons/svg/*.svg')
    .pipe(raster({scale : 2}))
    .pipe(rename({extname : '.png', suffix : '@2x'}))
    .pipe(gulp.dest('dist/icons/png/@2x'))
    cb(err)
});

gulp.task('optimiseImages', ['createPNG', 'createRetinaPNG'], function(){
  return gulp.src('dist/icons/png/**/*.png')
    .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
    .pipe(gulp.dest('dist/icons/png/'))
});

gulp.task('processIcons', ['cleanSVG', 'createPNG', 'createRetinaPNG', 'optimiseImages']);

// Compile & Minimise SCSS
gulp.task('sass', function(){
  return gulp.src('site/assets/scss/*')
    .pipe(sass({outputStyle : 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('site/assets/css'));
});

watchScss.on('change', function(event){
  console.log('Compiling Css...');
});

// Remove .DS_Store
gulp.task('clean', function(){
  return del(['**/.DS_Store']);
});

gulp.task('default');
