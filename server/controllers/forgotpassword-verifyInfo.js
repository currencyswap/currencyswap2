'use strict';
var userService = require('../services/user-service');
var crypto = require('crypto');
var constant = require('../libs/constants/constants');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var userEmail = req.body.email;
        userService.verifyResetPwdInfo(userEmail, function (err, response) {
            if (err) {
                return res.status(constant.HTTP_FAILURE_CODE).send(err)
            } else {
                return res.status(constant.HTTP_SUCCESS_CODE).send({});
            }
        });
    });

    return router;
};
