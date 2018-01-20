// const jwt = require('jsonwebtoken')
// const config = require('./server/config')

const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// 引入 mongoose 相关模型
require('./server/models/admin')
require('./server/models/article')
require('./server/models/category')
require('./server/models/comment')
require('./server/models/like')
require('./server/models/user')
// 引入 api 路由
const routes = require('./server/routes/index')
const path = require('path')
const app = require('express')()
const compression = require('compression')
const { Nuxt, Builder } = require('nuxt')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and set Nuxt.js options
const config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// 引用 esj 模板引擎
app.set('views', path.join(__dirname, 'dist'))
app.engine('.html', require('ejs').__express)
app.set('view engine', 'ejs')

app.use(compression({threshold: 0}))

// 日志
app.use(logger('":method :url" :status :res[content-length] ":referrer" ":user-agent"'))
// body 解析中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// cookie 解析中间件
app.use(cookieParser())
// 设置 express 根目录
// api 路由
app.use('/api', routes)

const nuxt = new Nuxt(config)

// Start build process in dev mode
if (config.dev) {
    const builder = new Builder(nuxt)
    builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Start express server
app.listen(port, host)
