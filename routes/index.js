var express = require('express')
var router  = express.Router()
var path    = require('path')
var request = require('request')
var async   = require('async')
var op      = require('object-path')
var debug   = require('debug')('app:' + path.basename(__filename).replace('.js', ''))



// GET home page
router.get('/', function(req, res, next) {
    request.get({url: APP_ENTU_URL + '/entity', qs: {definition: 'terminal'}, strictSSL: true, json: true}, function(error, response, body) {
        if(error) return callback(error)
        if(response.statusCode !== 200 || !body.result) return callback(new Error(op.get(body, 'error', body)))

        terminals = {}
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

                op.insert(terminals, op.get(body, 'result.properties.city.values.0.db_value', null), terminal)
                callback()
            })

        }, function(error){
            if(error) return callback(error)

            res.render('index', {
                terminals: terminals
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



module.exports = router