var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var changed = require('gulp-changed');

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


gulp.task('compile', function (callback) {
  return runSequence(
    ['less', 'es6'],
    callback
  );
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
