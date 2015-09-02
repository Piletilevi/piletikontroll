if(process.env.NEW_RELIC_LICENSE_KEY) require('newrelic')

var express = require('express')
var path    = require('path')
var stylus  = require('stylus')
var favicon = require('serve-favicon')
var bparser = require('body-parser')



// global variables (and list of all used environment variables)
APP_VERSION   = require('./package').version
APP_STARTED   = new Date().toISOString()
APP_PORT      = process.env.PORT || 3000
APP_ENTU_URL  = process.env.ENTU_URL || 'https://piletilevi.entu.ee/api2'
APP_ENTU_USER = process.env.ENTU_USER
APP_ENTU_KEY  = process.env.ENTU_KEY
APP_PL_URL    = process.env.PL_URL



express()
    // jade view engine
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')

    // parse POST requests
    .use(bparser.json())
    .use(bparser.urlencoded({extended: true}))

    // stylus to css converter
    .use(stylus.middleware({src: path.join(__dirname, 'public'), compress: true}))

    // static files path & favicon
    .use(express.static(path.join(__dirname, 'public')))
    .use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

    // routes mapping
    .use('/',         require('./routes/index'))

    // 404
    .use(function(req, res, next) {
        var err = new Error('Not Found')
        err.status = 404
        next(err)
    })

    // error
    .use(function(err, req, res, next) {
        var status = parseInt(err.status) || 500

        res.status(status)
        res.render('error', {
            title: status,
            message: err.message
        })

        if(err.status !== 404) console.log(err)
    })

    // start server
    .listen(APP_PORT)



console.log(new Date().toString() + ' started listening port ' + APP_PORT)
