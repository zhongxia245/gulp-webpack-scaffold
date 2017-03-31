var gulp = require('gulp')
var qiniu = require('gulp-qiniu')
var config = require('../config')

var accessKey = config.QN_ACCESS_KEY
var secretKey = config.QN_SECRE_KEY
var bucket = config.QN_BUCKET
var dir = config.QN_DIR
var upload = config.QN_UPLOAD_URL

gulp.task('uploadQN', () => {
  return gulp.src(['release/**', '!release/**/*.map'])
    .pipe(qiniu({
      accessKey: accessKey,
      secretKey: secretKey,
      bucket: bucket
    }, {
        dir: dir,
        uploadURL: upload
      }))
})