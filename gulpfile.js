var nPath = require('path');
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
var rollup = require('rollup');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var header = require('gulp-header');

var KarmaServer = require('karma').Server;

var path = {
  source: 'src/**/*.js',
  less: 'src/**/*.less',
  output: 'dist/',
  release: 'release/',
  outputCss: 'dist/**/*.css'
};

var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

//
// Compile Tasks
// ------------------------------------------------------------
gulp.task('es6', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel())
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(changed(path.output, { extension: '.css' }))
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function () {
  return gulp.src([path.output, path.release])
    .pipe(vinylPaths(del));
});

gulp.task('compile', function (callback) {
  return runSequence(
    ['less', 'es6'],
    callback
    );
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

gulp.task('watch', ['serve'], function () {
  var watcher = gulp.watch([path.source, path.less, '*.html'], ['compile']);
  watcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

//
// Release Tasks
// ------------------------------------------------------------

gulp.task('release', function (callback) {
  return runSequence(
    'clean',
    ['release-less', 'release-build'],
    'release-umd',
    'release-common',
    'release-es6-min',
    callback
    );
});

gulp.task('release-less', function () {
  return gulp.src(['src/themes/*.less', 'src/dataTable.less'])
    .pipe(less())
    .pipe(gulp.dest(path.release));
});

gulp.task('release-build', function () {
  return rollup.rollup({
    entry: 'src/dataTable.js',
    external: ['angular']
  }).then(function (bundle) {
    return bundle.write({
      dest: 'release/dataTable.es6.js',
      format: 'es6',
      moduleName: 'DataTable'
    });
  });
});

gulp.task('release-umd', function () {
  return gulp.src('release/dataTable.es6.js')
    .pipe(babel({
      plugins: [
        "transform-es2015-modules-umd"
      ],
      moduleId: 'DataTable'
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('dataTable.js'))
    .pipe(gulp.dest("release/"))
});

gulp.task('release-common', function () {
  return gulp.src('release/dataTable.es6.js')
    .pipe(babel({
      plugins: [
        "transform-es2015-modules-commonjs"
      ],
      moduleId: 'DataTable'
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('dataTable.cjs.js'))
    .pipe(gulp.dest("release/"))
});

gulp.task('release-es6-min', function () {
  return gulp.src('release/dataTable.es6.js')
    .pipe(babel({
      plugins: [
        "transform-es2015-modules-umd"
      ],
      moduleId: 'DataTable'
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('dataTable.min.js'))
    .pipe(gulp.dest("release/"))
});


//
// Test Tasks
// ------------------------------------------------------------

gulp.task('test', ['compile'], function (done) {
  var server = new KarmaServer({
    configFile: nPath.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, function () {
    done();
  });

  server.start();
});

gulp.task('test-watch', ['compile'], function (done) {
  var server = new KarmaServer({
    configFile: nPath.join(__dirname, 'karma.conf.js'),
    singleRun: false
  }, function () {
    done();
  });

  server.start();
});
