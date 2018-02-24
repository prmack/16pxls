const gulp = require('gulp');
const del = require('del');
const cleanSketch = require('gulp-clean-sketch');
const svgmin = require('gulp-svgmin');
const raster = require('gulp-raster');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const svgcss = require('gulp-svg-css');
const embedSvg = require('gulp-embed-svg');
const sass = require('gulp-sass');
const watchScss = gulp.watch('site/assets/scss/*', ['sass']);


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

// Optimise Images
gulp.task('optimiseImages', ['createPNG', 'createRetinaPNG'], function(){
  return gulp.src('dist/icons/png/**/*.png')
    .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
    .pipe(gulp.dest('dist/icons/png/'))
});

// Generate Css
gulp.task('genCss', ['cleanSVG'], function(){
  return gulp.src('dist/icons/svg/*.svg')
    .pipe(svgcss({
      fileName : '16px-icons'
    }))
    .pipe(gulp.dest('dist/css/'))
});

// SVG Embed
gulp.task('embedSVG', function(){
  return gulp.src('site/_site/*.html')
    .pipe(embedSvg({
      selectors : '.svg',
      root : 'site/'
    }))
    .pipe(gulp.dest('site/_site'))
});

gulp.task('processIcons', ['cleanSVG', 'genCss', 'createPNG', 'createRetinaPNG', 'optimiseImages']);

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
