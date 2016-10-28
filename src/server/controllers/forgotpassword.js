'use strict';
var mailSender = require('../libs/mail-sender');
var userService = require('../services/user-service');
var errorUtil = require('../libs/errors/error-util');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var userEmail = req.body.email;
        userService.resetPassword(userEmail, function (err, updatedUser) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send({});
            }
        });
    });

    return router;
};
