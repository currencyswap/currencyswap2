'use strict';


var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');
var multer  = require('multer');
var md5 = require('js-md5');
var async = require('async');
var constant = require('../libs/constants/constants');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/server/libs/media')
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
        if (!req.file) {
            var updatingUser = req.body;
            async.waterfall([
                function (next) {
                    userService.getUserByUsernameWithoutRelationModel(updatingUser, function (err, user) {
                        if (err) return next (err);
                        else {
                            if(updatingUser.currentPwd)if (md5(updatingUser.currentPwd) !== user.password) return next (errorUtil.createAppError(errors.INVALID_PASSWORD));
                            return next (null, user);
                        }
                    });
                },
                function (user, next) {
                    var filter = {};

                    for (var prop in updatingUser) {
                        if (prop === 'username' || prop === 'id' || prop === 'email') continue;
                        if (prop === 'newPwd') filter.password = md5(updatingUser[prop]);
                        filter[prop] = updatingUser[prop];
                    }
                    userService.updateUserInfo(user, filter, function (err, updatedUser) {
                        if (err) return next(err);
                        else {
                            if(filter.addresses.length > 0) {
                                userService.updateAddress(user.id,filter.addresses,function (err, updateAdress) {
                                    if(err) return next (err);
                                    else {
                                        return next(null);
                                    }
                                })
                            }else {
                                return next(null);
                            }

                        }
                    });

                }
            ], function (err) {
                if (err) res.status(constant.HTTP_FAILURE_CODE).send(err);
                else res.status(constant.HTTP_SUCCESS_CODE).send({});
            });
        } else {
            return res.status(200).send();
        }
    });

    return router;
};
