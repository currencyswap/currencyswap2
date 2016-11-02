'use strict';
var userService = require('../services/user-service');
var permissionService = require('../services/permission-service');
var groupService = require('../services/group-service');
var async = require('async');
var userConverter = require('../converters/user-converter');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        var newUser = req.body.newUser;

        async.waterfall([
            function (next) {
                groupService.findGroupByName('Blocked User', function (err, group) {
                    if (err) {
                        return next(err);
                    } else {
                        return next(null, group);
                    }

                })
            },
            function (group, next) {
                newUser.groups = [{
                    id: group.id,
                    name: group.name
                }];

                userService.registerUser(newUser, function (err, savedUser) {
                    if (err) return next(err);
                    else return next(null);
                })
            }
        ], function (err) {
            if (err) return res.status(500).send(err);
            else return res.status(200).send({});
        });
    });

    return router;
};