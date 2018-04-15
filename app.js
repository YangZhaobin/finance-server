const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors')
const index = require('./routes/index')
const artical = require('./routes/artical')
const website = require('./routes/website')
const classification = require('./routes/classification')

app.context.logger = require('./logger')('app');

const CONFIG = require('./config/app_config')
app.use(cors())
// error handler
onerror(app)
app.use(require('./controllers/error'));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

require('./middlewares/register_spider')(app.context);

// routes
app.use(index.routes(), index.allowedMethods())
app.use(artical.routes(), artical.allowedMethods())
app.use(website.routes(), website.allowedMethods())
app.use(classification.routes(), classification.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(CONFIG['port']);

module.exports = app
