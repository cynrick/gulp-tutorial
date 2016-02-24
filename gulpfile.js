var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');
var zip = require('gulp-zip');

// Less plugins
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var lessAutoprefix = new LessAutoprefix({
  browsers: ['last 2 versions']
});

// Handlebars plugins
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

// Image min plugins
var jpegoptim = require('imagemin-jpegoptim');
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var svgo = require('imagemin-svgo');
var size = require('gulp-size');

// File paths
var DIST_PATH = './public/dist';
var SCRIPTS_PATH = './public/scripts/**/*.js';
var CSS_PATH = './public/css/**/*.css';
var TEMPLATES_PATH = './templates/**/*.hbs';
var IMAGES_PATH = './public/images/**/*.{png,jpeg,jpg,gif,svg}';

// // Styles for CSS
// gulp.task('styles', function() {
//   console.log('Starting styles tasks...');

//   return gulp.src(['public/css/reset.css', CSS_PATH])
//     .pipe(plumber(function(err) {
//       console.log('Styles task error!');
//       console.log(err);
//       this.emit('end');
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(autoprefixer())
//     .pipe(concat('styles.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload());
// });

// Styles for SCSS
gulp.task('styles', function() {
  console.log('Starting styles tasks...');

  return gulp.src('./public/scss/styles.scss')
    .pipe(plumber(function(err) {
      console.log('Styles task error!');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// // Styles for LESS
// gulp.task('styles', function() {
//   console.log('Starting styles tasks...');

//   return gulp.src('./public/less/styles.less')
//     .pipe(plumber(function(err) {
//       console.log('Styles task error!');
//       console.log(err);
//       this.emit('end');
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(less({
//       plugins: [lessAutoprefix]
//     }))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload());
// });

// Scripts
gulp.task('scripts', function() {
  console.log('Starting scripts tasks...');

  return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err) {
      console.log('Scripts task error!');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  console.log('Starting images tasks...');

  return gulp.src(IMAGES_PATH)
    .pipe(size({
      title: 'Uncompressed images'
    }))
    .pipe(pngquant({
      quality: '65-80'
    })())
    .pipe(optipng({
      optimizationLevel: 3
    })())
    .pipe(jpegoptim({
      max: 70
    })())
    .pipe(svgo()())
    .pipe(size({
      title: 'Compressed images'
    }))
    .pipe(gulp.dest(DIST_PATH + '/images'));
});

// Templates
gulp.task('templates', function() {
  return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
      handlebars: handlebarsLib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Clean up dist folder
gulp.task('clean', function() {
  return del.sync([
    DIST_PATH
  ]);
});

// Zip up folders and files
gulp.task('export', ['default'], function() {
  return gulp.src('./public/**/*')
    .pipe(zip('gulp-website.zip'))
    .pipe(gulp.dest('./'));
});

// Default
gulp.task('default', ['clean' ,'styles', 'scripts', 'images', 'templates'], function() {
  console.log('Starting default tasks...');
});

// Watch
gulp.task('watch', ['default'], function() {
  console.log('Starting watch tasks...');
  require('./server.js');
  livereload.listen();
  gulp.watch(SCRIPTS_PATH, ['scripts']);
  // gulp.watch(CSS_PATH, ['styles']);
  gulp.watch('./public/scss/**/*.scss', ['styles']);
  // gulp.watch('./public/less/**/*.less', ['styles']);
  gulp.watch(TEMPLATES_PATH, ['templates']);
});
