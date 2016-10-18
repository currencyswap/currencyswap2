'use strict';

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {
        res.status(200).send(req.currentUser.permissions);
    });

    return router;
};
