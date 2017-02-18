var gulp = require('gulp')
var os = require('os')
var gulpOpen = require('gulp-open')
var connect = require('gulp-connect')

var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
}

//mac chrome: "Google chrome", 
var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'))

gulp.task('open', ['webpack-js', 'build-stylus', 'build-html', 'build-img'], function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/'
        }))
        .on('end', done)
})

gulp.task('connect', function () {
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    })
})