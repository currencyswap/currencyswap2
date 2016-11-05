'use strict';
var mailSender = require('../libs/mail-sender');
var userService = require('../services/user-service');
var errorUtil = require('../libs/errors/error-util');
var crypto = require('crypto');
var async = require('async');
var constant = require('../libs/constants/constants');
var md5 = require('md5');

//temporary
var errors = require('../libs/errors/errors');
var appConfig = require('../libs/app-config');
var util = require('util');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var newPassword = req.body.newPassword;
        var resetCode = req.body.resetCode;

        userService.resetPassword(newPassword, resetCode, function (err) {
            if (err) res.status(500).send(err);
            else res.status(200).send({});
        });
    });

    return router;
};
