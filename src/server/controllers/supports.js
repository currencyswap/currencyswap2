'use strict';

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var service = require('../services/support-service');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/creator', function (req, res, next) {
        var username = req.query.username;
        if (!username) {
            return res.status(404).send(errorUtil.createAppError(errors.INVALID_PARAMETER_INPUT));
        }
        service.getCreator(username).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.post('/', function (req, res, next) {
    });

    return router;
};
