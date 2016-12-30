'use strict';

var AppError = require('../libs/errors/app-error');
var stringUtil = require('../libs/utilities/string-util');
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var messages = require('../messages/messages');
var constant = require('../libs/constants/constants');
var userService = require('../services/user-service');
var userValidation = require('../validation/user-validation');
var async = require('async');
var util = require('util');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {
        userService.getLatestExchangeRate(function (err, latestExchangeRate) {
            if (err) {
                res.status(500).send(err)
            } else {
                var latestExchangeRateWithMedian = userService.attachMedianRate(latestExchangeRate);
                res.status(200).send(latestExchangeRateWithMedian);
            }
        })
    });

    return router;
};


