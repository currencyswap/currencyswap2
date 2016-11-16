'use strict';
var appConfig = require('../libs/app-config');
var errorUtil = require('../libs/errors/error-util');
var httpHeaderUtil = require('../libs/utilities/http-header-util');
var userValidation = require('../validation/user-validation');
var userService = require('../services/user-service');
var async = require('async');
var dateFormat = require('dateformat');
module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        async.waterfall([
            function (next) {
                httpHeaderUtil.getAuthBasicHeader(req, next);
            },
            function (user, next) {
                userValidation.validateUsernamePass(user, function (err) {
                    next(err, user);
                });
            },
            function (user, next) {
                userService.checkExpiredDateUse(user, function (err, responce) {
                    var expiredDate = dateFormat(responce.expiredDate, appConfig.DATE_FORMAT)
                    var currentData = dateFormat(new Date(), appConfig.DATE_FORMAT)
                    if(responce.username !== "admin" && expiredDate < currentData) {
                        return res.status(200).send({
                            expire: "expired"
                        });
                    }else {
                        userService.login(user, function (err, tokenKey) {
                            next(err, tokenKey);
                        });
                    }
                })
            }
        ], function (err, tokenKey) {

            if (err) {
                return res.status(299).send(err);
            }

            return res.status(200).send({
                token: tokenKey
            });

        });

    });

    return router;
};
