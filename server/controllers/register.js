'use strict';

var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');
var constant = require('../libs/constants/constants')

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {

        // handle active user account request
        if (req.body.activeCode) {
            var activeCode = req.body.activeCode;
            userService.activeUserAccount(activeCode, function (err, response) {
                if (err) return res.status(299).send(err);
                else return res.status(200).send({});
            });
        } else {
            // handle register request
            var clientUserData = req.body.newUser;

            var serverUserData = userConverter.convertUserData(clientUserData);

            userService.registerUser(serverUserData, function (err) {
                if (err) {
                    return res.status(constant.HTTP_FAILURE_CODE).send(err);
                } else {
                    return res.status(constant.HTTP_SUCCESS_CODE).send({});
                }
            });
        }
    });

    return router;
};