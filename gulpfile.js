'use strict';

var gulp = require('gulp');
var sass =  require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var beautify = require('gulp-beautify');
var imagemin = require('gulp-imagemin');
var gulpif = require('gulp-if');
var ignore = require('gulp-ignore');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var bust = require('gulp-buster');
var inject = require('gulp-inject');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 2000;
var production = (process.env.NODE_ENV === 'production')?true:false;

//gulp.task('default', ['images', 'sass', 'scripts', 'browser-sync'], function() {
gulp.task('default', ['sass','sassAuth','sass404','browser-sync'], function() {
  gulp.watch('./src/sass/**/*.scss', ['sass']);

  //gulp.watch('./src/js/**/*.js', ['scripts']);
});

//gulp.task('build', ['images', 'sass', 'scripts']);
gulp.task('build', ['sass','sassAuth','sass404',]);

// Just running the browser-sync task
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
    open: false,
  })
});

// SASS task that outputs compressed code if in production
//gulp.task('sass', function () {
  //return gulp.src('./src/sass/**/*.scss')
    //.pipe(sass(gulpif(production,{outputStyle: 'compressed'})).on('error', sass.logError))
    //.pipe(sourcemaps.write("."))
    //.pipe(autoprefixer())
    //.pipe(gulp.dest('./public/app'));
//});
var sources = gulp.src(['./src/sass/**/_*.scss','!' + './src/sass/404.scss', '!' + './src/sass/auth.scss', '!' + './src/sass/theme/conf/**/*.scss']);
var target = gulp.src('./src/sass/**/main.scss');

gulp.task('sass', function () {
return target.pipe(inject(sources, {
  starttag: '// injector',
  endtag: '// endinjector',
  transform: function (filepath) {
    return '@import "' + filepath + '";';
  },
  addRootSlash: false
}))
.pipe(sass(gulpif(production,{outputStyle: 'compressed'})).on('error', sass.logError))
.pipe(sourcemaps.write("."))
.pipe(autoprefixer())
.pipe(gulp.dest('./public/app'));
});


gulp.task('sassAuth', function () {
  return buildSingleScss('./src/sass/**/auth.scss');
});
gulp.task('sass404', function () {
  return buildSingleScss('./src/sass/**/404.scss');
});

var buildSingleScss = function (paths) {

  return gulp.src([paths])
    .pipe(sass(gulpif(production,{outputStyle: 'compressed'})).on('error', sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/app'));
};


gulp.task('clean', ['clean-css', 'clean-js']);

// Compile JS and uglify if production
//gulp.task('scripts', function () {
  //return gulp.src('./src/js/**/*.js')
    //.pipe(sourcemaps.init())
    //.pipe(babel())
    //.pipe(concat('all.js'))
    //.pipe(sourcemaps.write('.'))
    //.pipe(ignore.exclude([ "**/*.map" ]))
    //.pipe(gulpif(production, uglify(), beautify()))
    //.pipe(gulp.dest('./public/js'));
//});

// Minify images if prod
//gulp.task('images', function () {
  //return gulp.src('./src/images/**/*')
  //  .pipe(gulpif(production, imagemin({ progressive: true })))
  //  .pipe(gulp.dest('./public/images'));
//});

// nodemon with delay for server side changes.
gulp.task('nodemon', function(cb) {
  var started = false;
  return nodemon({
    script: 'app.js',
    ext: '.ejs .js',
    ignore: ["node_modules/**", "src/**", "public/images/**"]
  })
  .on('start', function() {
    if(!started) {
      cb();
      started = true;
    }
  })
  .on('restart', function () {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
      console.log('restarted!');
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});
