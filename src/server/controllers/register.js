'use strict';
var userService = require('../services/user-service');
var permissionService = require('../services/permission-service');
var userValidation = require('../validation/user-validation');
var groupService = require('../services/group-service');
var async = require('async');
var userConverter = require('../converters/user-converter');
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var clientUserData = req.body.newUser;

        var serverUserData = userConverter.convertUserData(clientUserData);

        userService.registerUser(serverUserData, function (err) {
            if (err) {
                // Do not redirect to client's error page for these errors
                if (err.code === errorUtil.createAppError(errors.USER_NAME_EXISTED).code
                    || err.code === errorUtil.createAppError(errors.EMAIL_EXISTED).code
                    || err.code === errorUtil.createAppError(errors.TRANSACTION_INIT_FAIL).code
                    || err.code === errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_TO_DB).code
                    || err.code === errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_ADDR_TO_DB).code
                    || err.code === errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_GR_TO_DB).code
                    || err.code === errorUtil.createAppError(errors.ERROR_TX_ROLLBACK).code
                    || err.code === errorUtil.createAppError(errors.ERROR_TX_COMMIT).code) {

                    res.status(299).send(err);
                }
            } else {
                return res.status(200).send({})
            }
        });
    });

    return router;
};