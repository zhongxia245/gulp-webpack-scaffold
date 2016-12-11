'use strict'
var gutil = require('gulp-util')
var through = require('through2')
var fs = require('fs')
var path = require('path')
var objectAssign = require('object-assign')

// 匹配 SVG 文件中的 SVG 标签，捕获 SVG 属性内容 和 SVG Children
var SVG_REG = /[\s\S]*?<svg([\s\S]*?)>([\s\S]*?)<\/svg>/m
// 匹配 viewBox 信息
var VIEWBOX_REG = /viewBox=['"]([\s\S]*?)['"]{1}?/m
// 匹配 SVG 标签宽度
var WIDTH_REG = /width=['"]([\s\S]*?)['"]{1}?/m
// 匹配 SVG 标签高度
var HEIGHT_REG = /height=['"]([\s\S]*?)['"]{1}?/m

// 匹配 class 内容
var CLASS_REG = /\sclass=['"]([\s\S]*?)['"]{1}?/m

var defaultOptions = {
  // 默认类名
  className: 'svgicon',
  // 匹配文件内 svg 标签
  regex: /<svg\s[\s\S]*?\{svg\{\{(\S*?)\}\}\}[\s\S]*?<\/svg>/gm,
  // svg 文件默认路径
  basePath: './'
}

module.exports = function (options) {
  var opt = objectAssign({}, defaultOptions, options)

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file)
      return callback()
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-svginline', 'Streaming not supported'))
      return callback()
    }

    if (file.isBuffer()) {
      var output = String(file.contents)

      output = output.replace(opt.regex, function (match, p1, p2) {

        var svgPath = p1
        svgPath = path.join(opt.basePath, svgPath)

        // 获取 HTML 中 SVG tag
        var htmlSvgTag = match.replace(/><\/svg>/m, '')

        // 将 svg 文件路径替换为 png 路径，预备 fallback 方案
        htmlSvgTag = htmlSvgTag.replace(/\{svg/m, '{')
        htmlSvgTag = htmlSvgTag.replace(/\.svg}}}/m, '.png}}}')

        // HTML 中 SVG tag 添加默认类名
        htmlSvgTag = addClass(htmlSvgTag, opt.className)

        try {
          var svgFile = fs.readFileSync(svgPath)
        } catch (e) {
          gutil.log(gutil.colors.red(svgPath + '不存在'))
        }

        // 获取 SVG 文件内容
        var svgString = new Buffer(svgFile).toString('utf-8')

        // 从 SVG 文件内容中获取 SVG 内容「不包含 SVG 节点」和 属性内容
        var svgAttr = ''
        var svgInline = svgString.replace(SVG_REG, function (match, p1, p2) {
          svgAttr = p1
          return p2
        })

        // HTML 中 SVG tag 添加 attributes  信息
        svgAttr = addAttrs(svgAttr, htmlSvgTag, [VIEWBOX_REG, HEIGHT_REG, WIDTH_REG])
        svgAttr = assignWH(svgAttr)

        htmlSvgTag = svgAttr + '>'

        return toOneline(htmlSvgTag + svgInline + '</svg>')
      })

      file.contents = new Buffer(output)

      return callback(null, file)
    }
  })
}

// 给生成的 HTML 中的 SVG 标签附加默认 Class
function addClass(tag, className) {
  var reg = RegExp('[\s\'"]' + className + '[\s\'"]')

  if (tag.match(CLASS_REG)) {
    tag = tag.replace(CLASS_REG, function (matchStr, p1) {
      if (matchStr.match(reg)) {
        return matchStr
      }
      return ' class="' + p1 + ' ' + className + '"'
    })
  } else {
    tag = tag + ' class="' + className + '"'
  }

  return tag

}

// 将原 SVG 文件内的 SVG 标签部分属性拷贝给 HTML 中的 SVG 标签
function addAttrs(srcAttr, targetTag, attrRegs) {

  var matchStr = ''

  attrRegs.forEach(function (reg, index) {
    matchStr = srcAttr.match(reg)

    if (matchStr) {
      targetTag += ' ' + matchStr[0]
    }

  })

  return targetTag
}

var FLOAT_REG = /[-+]?(\d*\.\d+|\d+)/g

function assignWH(attrStr) {
  var newAttrStr
  var replaceStr
  // 匹配 svg 标签宽度属性
  var WIDTH_REG = /width=['"]([\s\S]*?)['"]{1}?/m
  // 匹配 svg 标签高度属性
  var HEIGHT_REG = /height=['"]([\s\S]*?)['"]{1}?/m
  var hasWidth = WIDTH_REG.test(attrStr)
  var hasHeight = HEIGHT_REG.test(attrStr)
  var viewBoxStr = attrStr.match(VIEWBOX_REG)[0]
  var width = viewBoxStr.match(FLOAT_REG)[2]
  var height = viewBoxStr.match(FLOAT_REG)[3]

  if (hasWidth) {
    newAttrStr = attrStr.replace(WIDTH_REG, function (str, p1) {
      replaceStr = str.replace(FLOAT_REG, function (str) {
        return Math.round(str)
      })

      return replaceStr
    })
  } else {
    attrStr = attrStr + ' width=' + Math.round(width)
  }

  if (hasHeight) {
    newAttrStr = attrStr.replace(HEIGHT_REG, function (str, p1) {
      replaceStr = str.replace(FLOAT_REG, function (str) {
        return Math.round(str)
      })

      return replaceStr
    })
  } else {
    attrStr = attrStr + ' height=' + Math.round(height)
  }

  return attrStr
}


// 将 SVG 文件内容转换成一行
function toOneline(str) {
  return str.replace(/[\r\n\t ]+/g, ' ')
}
