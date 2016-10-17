'use strict';

var AppError = require('../libs/errors/app-error');
var errors = require('../libs/errors/errors');
var stringUtil = require('../libs/utilities/string-util');
var messages = require('../messages/messages');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');
var appConfig = require('../libs/app-config');
var util = require('util');

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        res.status(200).send({ message : 'pong' });
    });

    router.get('/:id', function (req, res) {
        res.status(200).send({ message : 'pong' });        
    });

    return router;
};

