var fs = require('fs')
var gulp = require('gulp')
var stylus = require('gulp-stylus')
var gulpif = require('gulp-if')
var watch = require('gulp-watch')
var plumber = require('gulp-plumber')
var nib = require('nib')
var replace = require('gulp-replace')
var livereload = require('gulp-livereload')
var sourcemaps = require('gulp-sourcemaps')

var REGEX = global.REGEX
var REG_BUILD = global.REG_BUILD
var IMG_FILE = global.IMG_FILE
var AUDIO_FILE = global.AUDIO_FILE

var root = 'src'
var dirs = fs.readdirSync(root)
var STYLUS_TASKS = []

//遍历根目录下的所有子目录
dirs.forEach(function (item) {
  if (fs.statSync(root + '/' + item).isDirectory()) {
    STYLUS_TASKS.push(item)
  }
})

/**
 * 寻找子目录下的styl样式文件，并转换成css文件
 */
for (var i = 0; i < STYLUS_TASKS.length; i++) {
  (function (i) {
    gulp.task('build-stylus-' + STYLUS_TASKS[i], function () {
      return gulp.src(['src/' + STYLUS_TASKS[i] + '/**/*.styl', '!src/' + STYLUS_TASKS[i] + '/**/_*.styl'])
        .pipe(gulpif(!global.is_production, plumber()))
        .pipe(gulpif(!global.is_production, sourcemaps.init()))
        .pipe(stylus({ use: [nib()], 'include css': true }))
        .pipe(gulpif(!global.is_production, sourcemaps.write()))
        .pipe(replace(REGEX, REG_BUILD))
        .pipe(gulp.dest('dist/' + STYLUS_TASKS[i]))
        .pipe(livereload())
    })
  })(i)
}

/**
 * 监听，文件变动，则重新构建
 */
gulp.task('watch', function (event) {
  // 监听样式文件
  for (var i = 0; i < STYLUS_TASKS.length; i++) {
    (function (i) {
      watch('src/' + STYLUS_TASKS[i] + '/**/*.styl', function () {
        gulp.start('build-stylus-' + STYLUS_TASKS[i])
      })
    })(i)
  }

  // 监听JS文件
  watch('src/**/*.js', function () {
    gulp.start('webpack-js')
  })

  // 监听html文件
  watch('src/**/*.html', function () {
    gulp.start('build-html')
  })

  // 监听图片文件
  watch(IMG_FILE, function () {
    gulp.start('build-img')
  })
})


// gulp.task('dev', ['connect', 'watch', 'open'], function () {
gulp.task('dev', ['connect', 'webpack-js', 'build-stylus', 'build-html', 'build-img', 'watch'], function () {
  global.is_production = false
  livereload.listen()
})
