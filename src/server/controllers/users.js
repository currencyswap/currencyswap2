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
        var updatingUser = req.body;
        console.log("updatingUser:",updatingUser);
        async.waterfall([
            function (next) {
                userService.getUserByUsernameWithoutRelationModel(updatingUser, function (err, user) {
                    if (err) return next (err);
                    else {
                        return next (null, user);
                    }
                });
            },
            function (user, next) {
                if (updatingUser.addresses && updatingUser.addresses.length > 0  && (updatingUser.addresses[0].address
                    || updatingUser.addresses[0].city
                    || updatingUser.addresses[0].postcode
                    || updatingUser.addresses[0].state
                    || updatingUser.addresses[0].country)) {

                    user.addresses(function (err, addresses) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            if (!addresses || addresses.length === 0) {
                                user.addresses.create(updatingUser.addresses, function (err, updatedUser) {
                                    if (err) return next(err);
                                    else {
                                        return next (null);
                                    }
                                })
                            } else {
                                app.models.Address.findById(addresses[0].id, function (err, address) {
                                    if (err) return next(err);
                                    else {
                                        if (!address) return next(err);
                                        else {
                                            address.updateAttributes(updatingUser.addresses[0], function (err, updatedAddresses) {
                                                if (err) return next(err);
                                                else {
                                                    var filter = {};
                                                    for (var prop in updatingUser) {
                                                        if (prop === 'username' || prop === 'id' || prop === 'email' || prop === 'addresses') continue;
                                                        if (prop === 'newPwd') filter.password = md5(updatingUser[prop]);
                                                        filter[prop] = updatingUser[prop];
                                                    }

                                                    user.updateAttributes(filter, function (err, updatedUser) {
                                                        if (err) return next (err);
                                                        else {
                                                            return next (null);
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    });
                } else {
                    var filter = {};
                    for (var prop in updatingUser) {
                        if (prop === 'username' || prop === 'id' || prop === 'email' || prop === 'addresses') continue;
                        if (prop === 'newPwd') filter.password = md5(updatingUser[prop]);
                        filter[prop] = updatingUser[prop];
                    }

                    user.updateAttributes(filter, function (err, updatedUser) {
                        if (err) return next (err);
                        else {
                            console.log('updatedUser: ', updatedUser);
                            return next (null);
                        }
                    })
                }

            }
        ], function (err) {
            if (err) res.status(constant.HTTP_FAILURE_CODE).send(err);
            else res.status(constant.HTTP_SUCCESS_CODE).send({});
        });
    });

    router.put('/:username', function (req, res) {
        res.status(constant.HTTP_SUCCESS_CODE).send({});
    });

    return router;
};
