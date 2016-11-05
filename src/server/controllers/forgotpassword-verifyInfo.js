'use strict';
var mailSender = require('../libs/mail-sender');
var userService = require('../services/user-service');
var errorUtil = require('../libs/errors/error-util');
var crypto = require('crypto');

//temporary
var errors = require('../libs/errors/errors');
var appConfig = require('../libs/app-config');
var util = require('util');
module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var userEmail = req.body.email;
        userService.verifyResetPwdInfo(userEmail, function (err, response) {
            if (err) {
                return res.status(500).send(err)
            } else {
                return res.status(200).send({});
            }
        });
    });

    return router;
};
