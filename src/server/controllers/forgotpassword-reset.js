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
        if (!req.body.password) {
            var userEmail = req.body.email;
            var resetCode = req.body.resetCode;

            userService.resetPassword(userEmail, resetCode, function (err) {
                if (err) return res.status(500).send(err);
                else return res.status(200).send({});
            });
        } else {
            var newPassword = req.body.password;
            var userEmail = req.body.email;

            async.waterfall([
                function (next) {
                    app.models.Member.findByEmail(userEmail, function (err, user) {
                        if (err) {
                            return next(errorUtil.createAppError(errors.MEMBER_NO_EMAIL));
                        }
                        return next(null, user);
                    });
                },
                function (user, next) {
                    user.updateAttribute(constant.PASSWORD_FIELD, md5(newPassword), function (err) {
                        if (err) return next(errorUtil.createAppError(errors.SERVER_GET_PROBLEM))
                        else return next(null);
                    })
                }
            ], function (err, updatedUser) {
                if (err) return res.status(500).send(err);
                else return res.status(200).send({});
            });


        }
    });

    return router;
};
