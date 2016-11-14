'use strict';

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var async = require('async');
var util = require('util');
var constant = require('../libs/constants/constants');

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        userService.findAllUsers(function (err, users) {
            if (err) return res.status(299).send(err);
            else return res.status(200).send(users)
        })
    });

    router.get('/:id', function (req, res) {

        var userId = req.params.id;

        if ( !userId ) {

            var err = errorUtil.createAppError( errors.MEMBER_NO_USERID );

            return res.status(403).send( errorUtil.getResponseError( err ) );
        }
        userService.getUserDetail(userId, function (err, user) {
            if (err) {
                if (err.code === errorUtil.createAppError(errors.SERVER_GET_PROBLEM).code
                    || err.code === errorUtil.createAppError(errors.NO_USER_FOUND_IN_DB).code) {
                    return res.status(299).send(err);
                }
            } else {
                return res.status(200).send(user)
            }
        });
    });

    router.post('/:id', function (req, res) {

        async.waterfall([
            function (next) {
                userService.getUserByUsernameWithoutRelationModel(updatingUser.username, function (err, user) {
                    if (err) return next (err);
                    else {
                        return next (null, user);
                    }
                });
            },
            function (user, next) {
                var filter = {};

                for (var prop in updatingUser) {
                    if (prop === 'username' || prop === 'id' || prop === 'email') continue;
                    filter[prop] = updatingUser[prop];
                }

                userService.updateUserInfo(user, filter, function (err, updatedUser) {
                    if (err) return next(err);
                    else {
                        return next(null);
                    }
                });

            }
        ], function (err) {
            if (err) res.status(constant.HTTP_FAILURE_CODE).send(err);
            else res.status(constant.HTTP_SUCCESS_CODE).send({});
        });
    });

    return router;
};
