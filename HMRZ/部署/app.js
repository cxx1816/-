const Koa  = require('koa')
const serve = require('koa-static')
const proxy = require('koa2-proxy-middleware')

const app = new Koa() //服务器对象

// 添加代理转发规则
app.use(proxy({
  targets: {
      // 匹配/api开头后面任意字符正则
    '/api/(.*)': {
        target: 'http://ihrm.itheima.net', //后端服务器地址
        changeOrigin: true
    }
  }
}))

// 将public下的代码静态化(浏览器访问这个服务器后，就把public当做服务器根目录)
// 前端访问时，无需添加public名字路径
app.use(serve(__dirname + "/public"))

app.listen(3333, () => {
  console.log('人资项目启动: 3333端口')
})