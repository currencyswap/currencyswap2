'use strict';

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {
        // Step 1: Check if user is active or not
        // Step 2:
    });

    return router;
};
