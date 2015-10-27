if(process.env.NEW_RELIC_LICENSE_KEY) require('newrelic')

var express = require('express')
var path    = require('path')
var stylus  = require('stylus')
var favicon = require('serve-favicon')
var bparser = require('body-parser')
var raven   = require('raven')



// global variables (and list of all used environment variables)
APP_VERSION   = process.env.VERSION || require('./package').version
APP_STARTED   = new Date().toISOString()
APP_PORT      = process.env.PORT || 3000
APP_ENTU_URL  = process.env.ENTU_URL || 'https://piletilevi.entu.ee/api2'
APP_ENTU_USER = process.env.ENTU_USER
APP_ENTU_KEY  = process.env.ENTU_KEY
APP_PL_URL    = process.env.PL_URL
APP_SENTRY    = process.env.SENTRY_DSN



// initialize getsentry.com client
var raven_client = new raven.Client({
    release: APP_VERSION,
    dataCallback: function(data) {
        delete data.request.env
        return data
    }
})



// start express app
var app = express()

// get correct client IP behind nginx
app.set('trust proxy', true)

// jade view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// logs to getsentry.com - start
app.use(raven.middleware.express.requestHandler(raven_client))

// parse POST requests
app.use(bparser.json())
app.use(bparser.urlencoded({extended: true}))

// stylus to css converter
app.use(stylus.middleware({src: path.join(__dirname, 'public'), compress: true}))

// static files path & favicon
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// routes mapping
app.use('/', require('./routes/index'))

// logs to getsentry.com - error
app.use(raven.middleware.express.errorHandler(raven_client))

// show error
app.use(function(err, req, res, next) {
    res.send({
        error: err.message,
        version: APP_VERSION,
        started: APP_STARTED
    })

    if(err.status !== 404) console.log(err)
})



// start server
app.listen(APP_PORT, function() {
    console.log(new Date().toString() + ' started listening port ' + APP_PORT)
})
