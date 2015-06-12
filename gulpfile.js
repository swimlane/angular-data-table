var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var changed = require('gulp-changed');
var Builder = require('systemjs-builder');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');

var path = {
  source:'src/**/*.js',
  less: 'src/**/*.less',
  output:'dist/',
  release: 'release/',
  outputCss: 'dist/**/*.css'
};

//
// Compile Tasks
// ------------------------------------------------------------

/*
  Compiles to System modules
 */
gulp.task('es6', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel({
      modules: 'system',
      moduleIds: true,
      comments: true,
      compact: false
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compile', function (callback) {
  return runSequence(
    ['less', 'es6'],
    callback
  );
});

/*
  Compiles to AMD modules
 */
gulp.task('es6-amd', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel({
      modules: 'amd',
      moduleIds: true,
      comments: true,
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compile-amd', function (callback) {
  return runSequence(
    ['less', 'es6-amd'],
    callback
  );
});

/*
  Compiles to CommonJS modules
 */
gulp.task('es6-common', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel({
      modules: 'common',
      moduleIds: true,
      comments: true,
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compile-common', function (callback) {
  return runSequence(
    ['less', 'es6-common'],
    callback
  );
});

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(changed(path.output, {extension: '.css'}))
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function() {
  return gulp.src([path.output])
    .pipe(vinylPaths(del));
});

gulp.task('clean-release', function() {
  return gulp.src([path.release])
    .pipe(vinylPaths(del));
});



//
// Dev Mode Tasks
// ------------------------------------------------------------
gulp.task('serve', ['compile'], function (done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

gulp.task('watch', ['serve'], function() {
  var watcher = gulp.watch([path.source, path.less, '*.html'], ['compile']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

//
// Release Tasks
// ------------------------------------------------------------

gulp.task('release', function(callback){
  return runSequence(
    'clean-release',
    'release-less',
    'build-system',
    'build-common',
    'build-amd'
  );
});

gulp.task('build-system', function(callback) {
  return runSequence(
    'clean',
    'compile',
    'concat-system',
    callback
  );
});

gulp.task('build-amd', function(callback){
  return runSequence(
    'clean',
    'compile-amd',
    'concat-amd',
    callback
  );
});

gulp.task('build-common', function(callback){
  return runSequence(
    'clean',
    'compile-common',
    'concat-common',
    callback
  );
});

gulp.task('release-less', function () {
  return gulp.src(['src/themes/*.less', 'src/data-table.less'])
    .pipe(less())
    .pipe(gulp.dest(path.release));
});

gulp.task('concat-amd', function(){
  return gulp.src(['dist/**/*.js'])
    .pipe(concat('data-table.amd.js'))
    .pipe(gulp.dest('./release/'));
})

gulp.task('concat-system', function(){
  return gulp.src(['dist/**/*.js'])
    .pipe(concat('data-table.system.js'))
    .pipe(gulp.dest('./release/'));
})

gulp.task('concat-common', function(){
  return gulp.src(['dist/**/*.js'])
    .pipe(concat('data-table.common.js'))
    .pipe(gulp.dest('./release/'));
})



