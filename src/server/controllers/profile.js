'use strict';

var AppError = require('../libs/errors/app-error');
var errors = require('../libs/errors/errors');
var stringUtil = require('../libs/utilities/string-util');
var messages = require('../messages/messages');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');
var appConfig = require('../libs/app-config');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {

        if (!req.currentUser || !req.currentUser.username) {
            return res.status(403).send({ message: messages.ERR_INVALID_USER });
        }

        userService.getUserByUsername(req.currentUser.username, function (err, userObj) {

            if (err) {
                let code = err.code == errors.SERVER_GET_PROBLEM ? 500 : 406;
                return res.status(code).send({ message: err.message });
            }

            return res.status(200).send( userConverter.convertUserToUserJSON( userObj ));

        });

    });

    return router;
}
