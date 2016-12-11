import './_base.js'

const cssPath = '{{{common/css/index.css}}}'

console.log('cssPath', cssPath)

setInterval(() => {
    document.body.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16)
}, 1000)