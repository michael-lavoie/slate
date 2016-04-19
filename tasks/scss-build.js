var gulp = require('gulp');
var postcss = require('gulp-postcss');
var postcss_import = require('postcss-import');
var scss_syntax = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var chokidar = require('chokidar');

var config = require('./reqs/config.js');
var utils = require('./reqs/utilities.js');
var messages = require('./reqs/messages.js');


/**
 * Concatenate and autoprefix scss with PostCSS
 *
 * @function build:scss
 * @memberof slate-cli.tasks.build
 * @static
 */
gulp.task('build:scss', ['build:scss-lint'], function() {
  return processScss();
});

/**
 * watches scss in src dir ...
 *
 * @function watch:scss
 * @memberof slate-cli.tasks.watch
 * @static
 */
gulp.task('watch:scss', ['build:scss-lint'], function() {
  chokidar.watch([config.paths.srcScss], {ignoreInitial: true})
    .on('all', function(event, path) {
      messages.logFileEvent(event, path);
      processScss();
    });
});

function processScss() {
  messages.logProcessFiles('build:scss', config.paths.parentIncludeScss);
  var processors = [
    postcss_import,
    autoprefixer
  ]
  return gulp.src(config.paths.parentIncludeScss)
    .pipe(plumber(utils.errorHandler))
    .pipe(postcss(processors, { syntax: scss_syntax }))
    .pipe(gulp.dest(config.paths.destAssets));
}
