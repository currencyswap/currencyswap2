'use strict';
var userService = require('../services/user-service');
var async = require('async');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        console.log('received request');
        var newUser = req.body.newUser;
        console.log('newUser: ', newUser);

        async.waterfall([
            function (next) {
                userService.createUser(newUser, function (err, savedUser) {
                    if (err) {
                        return next(err);
                    }
                    else return next(null, savedUser);
                })
            }
        ], function (err, savedUser) {
            if (err) {
                console.log('ERROR----->: ', err);
                return res.status(500).send({err});
            } else {
                console.log('Saved user done!');
                return res.status(200).send({savedUser});
            }
        });
    });

    return router;
};