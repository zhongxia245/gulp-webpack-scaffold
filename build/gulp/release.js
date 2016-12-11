var rev = require('gulp-rev')
var gulp = require('gulp')
var replace = require('gulp-replace')
var del = require('del')

function replaceFunc(match, p1) {
    console.log(p1)
    var manifest = require(global.MANIFEST)
    return global.DIST_DIR + manifest[p1]
}

gulp.task('release-js', [
    'webpack-js',
    'build-img',
    'build-stylus',
    'build-html'
], function () { })

//文件文件加上MD5,输出到 release目录下
gulp.task('release-rev', ['release-js'], function () {
    return gulp.src(['dist/**/*.css',
        'dist/**/*.js',
        'dist/**/*.+(png|gif|jpg|eot|woff|ttf|svg|ico)',
        'dist/**/*.+(mp3|ogg|wav)'],
        { base: './dist' })
        .pipe(rev())
        .pipe(gulp.dest('release'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release'))
})

//替换html，css,js 中使用到的文件换成md5形式的文件名
gulp.task('html-css-js-replace', ['release-rev'], function () {
    return gulp.src(['release/**/*.css', 'release/**/*.js', 'dist/**/*.html'])
        .pipe(replace(global.REGEX, replaceFunc))
        .pipe(gulp.dest('release'))
})

// 设置线上环境
gulp.task('set-release', function () {
    global.is_production = true
})

// 部署
gulp.task('release', ['set-release', 'html-css-js-replace'], function (cb) {
    del(['dist'], cb)
    gulp.start('uploadQN')
})
