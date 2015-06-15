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
var rollup = require( 'rollup' );
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var compilerOptions = {
  modules: 'system',
  moduleIds: false,
  comments: true,
  compact: false
};

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
gulp.task('es6', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(babel(compilerOptions))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
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

gulp.task('watch', ['serve'], function() {
  var watcher = gulp.watch([path.source, path.less, '*.html'], ['compile']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

//
// Release Tasks
// ------------------------------------------------------------
var excludes = {
  map: {
    'angular': '@empty',
  },
  paths:{
    "*": "src/*.js"
  }
};

gulp.task('release', function(callback) {
  return runSequence(
    'clean',
    'release-less',
    'release-build',
    'release-es6',
    'release-es6-helpers',
    'release-es6-helpers-min',
    //'release-sfx',
    //'release-sfx-min',
    //'release-sfx-runtime',
    //'release-sfx-runtime-min',
    callback
  );
});

gulp.task('release-less', function () {
  return gulp.src(['src/themes/*.less', 'src/data-table.less'])
    .pipe(less())
    .pipe(gulp.dest(path.release));
});

gulp.task('release-build', function () {
  return rollup.rollup({
    entry: 'src/data-table.js',
    external: [ 'angular' ]
  }).then( function ( bundle ) {
    return bundle.write({
      dest: 'release/data-table.es6.js',
      format: 'umd',
      moduleName: 'DataTable'
    });
  });
});

gulp.task('release-es6', function () {
  return gulp.src('release/data-table.es6.js')
    .pipe(babel({
      comments: false,
      compact: false,
      externalHelpers: true
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(rename('data-table.js'))
    .pipe(gulp.dest("release/"))
});

gulp.task('release-es6-helpers', function () {
  return gulp.src('release/data-table.es6.js')
    .pipe(babel({
      comments: false,
      compact: false
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(rename('data-table.helpers.js'))
    .pipe(gulp.dest("release/"))
});

gulp.task('release-es6-helpers-min', function () {
  return gulp.src('release/data-table.es6.js')
    .pipe(babel({
      comments: false,
      compact: false
    }))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(uglify())
    .pipe(rename('data-table.helpers.min.js'))
    .pipe(gulp.dest("release/"))
});

/* gulp.task('release-sfx', function () {
  var config = { 
    defaultJSExtensions: true,
    paths:{
      "*": "src/*",
      "github:*": "jspm_packages/github/*",
      "npm:*": "jspm_packages/npm/*"
    },
    map: { 
      'angular': '@empty',
      "babel": "npm:babel-core@5.5.6",
      "babel-runtime": "npm:babel-runtime@5.5.6"
    },
    transpiler: 'babel'
  };

  var builder = new Builder(config);
    //return builder.loadConfig('./config.js').then(function(){
    //builder.config(excludes);
      return builder.buildSFX('data-table', './release/data-table.js', {
        runtime: false,
        mangle: false
      })
    //});
}); */
