'use strict'
var path = require('path')
var webpack = require('webpack')
var glob = require('globby')
var config = require('./config.js')

/**
 * 获取所有的JS文件入口
 * @returns 
*/
function getEntries() {
  var map = {}
  var fileList = glob.sync([
    'src/**/*.js',
    '!src/**/_*.js'
  ])

  fileList.forEach(function (file) {
    var name = path.basename(file)
    var filePath = path.relative('src', file)
    map[filePath] = filePath
  })
  return map
}

module.exports = {
  context: __dirname,
  devtool: '#source-map',
  entry: getEntries(),
  output: {
    path: path.join(__dirname, '../' + config.output),
    filename: '[name]'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  },
  /**
   * 必须配置这个，否则报找不到  babel-loader
   * 因为配置文件没有放在根目录
   */
  resolveLoader: {
    root: path.resolve(__dirname, '../node_modules')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    })
  ],
  resolve: {
    root: path.join(__dirname, '../' + config.root),
    extensions: ['', '.js', '.jsx'],
  }
}
