'use strict';
var userService = require('../services/user-service');
var permissionService = require('../services/permission-service');
var userValidation = require('../validation/user-validation');
var groupService = require('../services/group-service');
var async = require('async');
var userConverter = require('../converters/user-converter');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var newUser = req.body.newUser;

        async.waterfall([
            function (next) {
                var user = userConverter.convertUserData(newUser);
                return next(null, user);
            },
            function (user, next) {
                groupService.findGroupByName(user.group, function (err, group) {
                    if (err) {
                        return next(err);
                    } else {
                        return next(null, user, group);
                    }

                })
            },
            function (user, group, next) {
                user.groups = [{
                    id: group.id,
                    name: group.name
                }];

                userService.registerUser(user, function (err, savedUser) {
                    if (err) return next(err);
                    else return next(null);
                })
            }
        ], function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            else return res.status(200).send({});
        });
    });

    return router;
};