var reqdir = require('require-dir')

global.MANIFEST = __dirname + '/release/rev-manifest.json'
global.REGEX = /\{\{\{(\S*?)\}\}\}/g
global.REG_BUILD = '/$1'
global.IMG_FILE = ['src/**/*.+(png|gif|jpg|eot|woff|ttf|svg|ico)']
global.DIST_DIR = '/'
global.JS_FILE = [
    'src/**/*.js',
    '!src/**/_*.js'
]

global.AUDIO_FILE = ['src/**/*.+(ogg|mp3|wav)']

reqdir('./build/gulp/')