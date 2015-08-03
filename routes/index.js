var express = require('express')
var router  = express.Router()
var path    = require('path')
var request = require('request')
var async   = require('async')
var op      = require('object-path')
var _       = require('underscore')
var debug   = require('debug')('app:' + path.basename(__filename).replace('.js', ''))



// GET home page
router.get('/', function(req, res, next) {
    request.get({url: APP_ENTU_URL + '/entity', qs: {definition: 'terminal'}, strictSSL: true, json: true}, function(error, response, body) {
        if(error) return next(error)
        if(response.statusCode !== 200 || !body.result) return next(new Error(op.get(body, 'error', body)))

        var terminals = []
        async.each(body.result, function(entity, callback) {
            request.get({url: APP_ENTU_URL + '/entity-' + entity.id, strictSSL: true, json: true}, function(error, response, body) {
                if(error) return callback(error)
                if(response.statusCode !== 200 || !body.result) {
                    if(body.error) {
                        return callback(new Error(body.error))
                    } else {
                        return callback(new Error(body))
                    }
                }

                var terminal = {
                    entu_id: op.get(body, 'result.id', null)
                }

                terminal.id = op.get(body, 'result.properties.id.values.0.db_value', null)
                terminal.name = op.get(body, 'result.properties.name.values.0.db_value', null)
                terminal.city = op.get(body, 'result.properties.city.values.0.db_value', null)

                terminals.push(terminal)
                callback()
            })

        }, function(error){
            if(error) return next(error)

            res.render('index', {
                terminals: _.groupBy(_.sortBy(terminals, 'city'), 'city')
            })
        })
    })
})



// GET ticket info
router.get('/ticket', function(req, res, next) {
    request.get({url: APP_PL_URL, qs: req.query, strictSSL: true, json: true}, function(error, response, body) {
        if(error) return next(error)
        if(response.statusCode !== 200) return next(new Error(op.get(body, 'error', body)))

        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(body)
    })
})



// GET app version and start datetime
router.get('/version', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send({
        version: APP_VERSION,
        started: APP_STARTED
    })
})



module.exports = router
