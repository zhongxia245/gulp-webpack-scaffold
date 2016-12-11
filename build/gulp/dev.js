var fs = require('fs')
var gulp = require('gulp')
var stylus = require('gulp-stylus')
var gulpif = require('gulp-if')
var watch = require('gulp-watch')
var plumber = require('gulp-plumber')
var nib = require('nib')
var replace = require('gulp-replace')
var liveload = require('gulp-livereload')
var sourcemaps = require('gulp-sourcemaps')

var REGEX = global.REGEX
var REG_BUILD = global.REG_BUILD
var IMG_FILE = global.IMG_FILE
var AUDIO_FILE = global.AUDIO_FILE

var css_path = 'src'
var dirs = fs.readdirSync(css_path)
var STYLUS_TASKS = []

dirs.forEach(function(item) {
    if (fs.statSync(css_path + '/' + item).isDirectory()) {
        STYLUS_TASKS.push(item)
    }
})

for (var i = 0; i < STYLUS_TASKS.length; i++) {
    (function(i) {
        gulp.task('build-stylus-' + STYLUS_TASKS[i], function() {
            return gulp.src(['src/' + STYLUS_TASKS[i] + '/**/*.styl', '!src/' + STYLUS_TASKS[i] + '/**/_*.styl'])
                .pipe(gulpif(!global.is_production, plumber()))
                .pipe(gulpif(!global.is_production, sourcemaps.init()))
                .pipe(stylus({ use: [nib()], 'include css': true }))
                .pipe(gulpif(!global.is_production, sourcemaps.write()))
                .pipe(replace(REGEX, REG_BUILD))
                .pipe(gulp.dest('dist/' + STYLUS_TASKS[i]))
                .pipe(liveload())
        })
    })(i)
}

gulp.task('watch', function(done) {
    for (var i = 0; i < STYLUS_TASKS.length; i++) {
        (function(i) {
            watch('src/' + STYLUS_TASKS[i] + '/**/*.styl', function() {
                gulp.start('build-stylus-' + STYLUS_TASKS[i])
            })
        })(i)
    }
    watch('src/**/*.js', function() {
        gulp.start('webpack-js')
    })

    watch('src/**/*.html', function() {
        gulp.start('build-html')
    })

    watch(IMG_FILE, function() {
        gulp.start('build-img')
    })
})


gulp.task('dev', ['connect', 'watch', 'open'], function() {
    global.is_production = false
    liveload.listen()
})
