>时间：2016-12-11 00:26:36  
作者：zhongxia

本教程主要讲解如何使用 gulp + webpack 搭建一个前端开发的脚手架，方便项目的开发。

## 一、背景
公司的项目主要是展示型页面（**PC端，移动端和放在APP里面活动页面**），也就没有很大的必要使用React，Angular, Vue 这几个主流的SPA类型的框架。

这里用上webpack主要是因为解决一些JS模块化的东西，当然如果有需要也可以使用React来实现一些公共的组件。

### 运用技术清单：
gulp + webpack + stylus + babel + autoprefix + postcss + nodejs + md5


## 二、脚手架功能分析
- [ ] 多页面gulp+webpack脚手架
- [ ] 预编译CSS，自动添加前缀，代码映射
- [ ] 静态文件地址根据开发和线上地址替换
- [ ] 热启动，浏览器自刷新
- [ ] 文件添加MD5
- [ ] 一键打包构建压缩代码，并上传到七牛


## 三、如何使用
```bash
# 下载代码
git clone [github-url]

# 安装依赖
npm install 

# 本地开发
npm run dev 

# 配置七牛的key
配置文件地址：build/config.js

# 部署上线(会自动上传到七牛，需要配置 ak,sk)
npm run release

# 代码规范
npm run lint 

# 会自动修复常规错误
npm run lint:fix  
```
 
## 四、生成代码截图
>文件加上 md5，路径自动替换
>目录结构保持不变

![](http://ww1.sinaimg.cn/large/006tKfTcgw1famv34szbwj31kw0xlqbo.jpg)


## 五、参考文章
1. [前端构建工具gulpjs的使用介绍及技巧](http://www.cnblogs.com/2050/p/4198792.html)
2. [【WEBPACK】教程资源收集](http://www.jianshu.com/p/fb13b929d511)