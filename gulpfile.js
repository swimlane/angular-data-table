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

var compilerOptions = {
  modules: 'system',
  moduleIds: false,
  comments: true,
  compact: false,
  stage: 0
};

var path = {
  source:'src/**/*.js',
  less: 'src/**/*.less',
  output:'dist/',
  outputCss: 'dist/**/*.css'
};

gulp.task('es6', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel(compilerOptions))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
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

gulp.task('compile', function (callback) {
  return runSequence(
    'clean',
    ['less', 'es6'],
    callback
  );
});

gulp.task('release', function(callback) {
  return runSequence(
    'compile',
    'release-compile',
    callback
  );
});

gulp.task('release-compile', function () {
  var builder = new Builder();
  return builder.loadConfig('./config.js').then(function(){
    //builder.loader.baseURL = path.resolve('./src');
    return builder.build('data-table', './release/data-table.js', { 
      runtime: false,
      mangle: false
    })
  });
});

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
