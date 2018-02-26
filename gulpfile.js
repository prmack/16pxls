const gulp = require('gulp');
const del = require('del');
const sketchClean = require('gulp-clean-sketch');
const svgmin = require('gulp-svgmin');
const raster = require('gulp-raster');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const svgCss = require('gulp-svg-css');
const fileList = require('gulp-filelist');

// Clean & Minimise SVG
gulp.task('cleanSVG', function(cb){
  return gulp.src('dist/svg/*.svg')
    .pipe(sketchClean())
    .pipe(svgmin({js2svg : {pretty : true}}))
    .pipe(gulp.dest('dist/svg'))
    cb(err);
});

// Create PNG
gulp.task('createPNG', ['cleanSVG'], function(cb) {
  return gulp.src('dist/svg/*.svg')
    .pipe(raster())
    .pipe(rename({extname : '.png'}))
    .pipe(gulp.dest('dist/png/@1x'))
    cb(err);
});

// Create PNG Scaled for Retina
gulp.task('createRetinaPNG', ['createPNG', 'cleanSVG'], function(cb){
  return gulp.src('dist/svg/*.svg')
    .pipe(raster({scale : 2}))
    .pipe(rename({extname : '.png', suffix : '@2x'}))
    .pipe(gulp.dest('dist/png/@2x'))
    cb(err)
});

// Optimise Images
gulp.task('optimiseImages', ['createPNG', 'createRetinaPNG'], function(){
  return gulp.src('dist/png/**/*.png')
    .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
    .pipe(gulp.dest('dist/png'))
});

// Generate Css
gulp.task('genCss', ['cleanSVG'], function(){
  return gulp.src('dist/svg/*.svg')
    .pipe(svgCss({
      fileName : '16pxls'
    }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('processIcons', ['cleanSVG', 'createPNG', 'createRetinaPNG', 'optimiseImages', 'genCss']);

// Create .JSON List of Icons
gulp.task('iconList', function(){
  gulp.src('dist/svg/*.svg')
  .pipe(fileList('iconList.json', {
    flatten : true,
    removeExtensions: true
  }))
  .pipe(gulp.dest('dist/reference/assets/json'))
});

// Compile HandleBars

// Remove .DS_Store
gulp.task('clean', function(){
  return del(['**/.DS_Store']);
});

// Clear Icons from Dist
gulp.task('cleanIcons', function(){
  return del(['dist/svg/*.svg', 'dist/png/@1x/*.png', 'dist/png/@2x/*.png', 'dist/css/*.css'])
});

gulp.task('default');
