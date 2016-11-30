'use strict';


var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var supportService = require('../services/support-service');
var userConverter = require('../converters/user-converter');
var multer  = require('multer');
var md5 = require('js-md5');
var async = require('async');
var constant = require('../libs/constants/constants');
var appRoot = require('app-root-path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/server/libs/media/')
    },
    filename: function (req, file, cb) {
        cb(null, req.currentUser.username + ".png");
    }
});

var upload = multer({ storage: storage });

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {
        if (!req.currentUser || !req.currentUser.username) {
            let err = errorUtil.createAppError( errors.MEMBER_NO_USERNAME );
            return res.status(403).send( errorUtil.getResponseError( err ) );
        }

        userService.getUserByUsername(req.currentUser.username, function (err, userObj) {
            if (err) {
                let code = err.code == errors.SERVER_GET_PROBLEM ? 500 : 406;
                return res.status(code).send( errorUtil.getResponseError( err ) );
            }

            return res.status(200).send(userObj);

        });

    });

    router.post('/', upload.single('file'), function (req, res, next) {
        return res.status(200).send({});
    });

    router.put('/', function (req, res, next) {
        var currentUser = req.currentUser;
        var updatingUser = req.body;
        async.waterfall([
            function (next) {
                userService.getUserByUsernameWithoutRelationModel(updatingUser, function (err, user) {
                    if (err) return next(err);
                    else {
                        if (updatingUser.currentPwd)if (md5(updatingUser.currentPwd) !== user.password) return next(errorUtil.createAppError(errors.INVALID_PASSWORD));
                        return next(null, user);
                    }
                });
            },function createMessage(user, next) {
                if(JSON.stringify(updatingUser) !== JSON.stringify(currentUser)) {
                    var message = {'title': updatingUser.username + constant.MSG.USER_EDITED_PROFILE_TITLE,
                        'message': updatingUser.username + constant.MSG.USER_EDITED_PROFILE_CONTENT,
                        'groupName': 'Admin',
                        'creatorId': user.id};
                    supportService.messageToGroup(message);
                }
                return next (null, user);
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

    return router;
};
