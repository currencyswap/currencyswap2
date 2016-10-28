'use strict';

var exports = module.exports;
var md5 = require('js-md5');
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var redis = require('../libs/redis');
var token = require('../libs/token');
var async = require('async');
var userConverter = require('../converters/user-converter');
var mailSender = require('../libs/mail-sender');
var constant = require('../libs/constants/constants');
var appConfig = require('../libs/app-config');

exports.createUser = function (user, callback) {

    if (user.username === undefined) {
        return callback(errorUtil.createAppError(errors.MEMBER_NO_USERNAME));
    }

    if (user.password === undefined) {
        return callback(errorUtil.createAppError(errors.MEMBER_NO_PASSWORD));
    }

    if (user.email === undefined) {
        return callback(errorUtil.createAppError(errors.MEMBER_NO_EMAIL));
    }

    user.password = md5(user.password);

    async.waterfall([
        function (next) {
            app.models.Member.create(user, function (err, instance) {
                next(err, instance);
            });
        },
        function (instance, next) {

            if (!user.addresses || user.addresses.lengh <= 0) {
                return next(null, instance);
            }

            user.addresses.forEach(function (addr) {
                addr.memberId = instance.id;
            });

            instance.addresses.create(user.addresses, function (err) {
                next(err, instance);
            });

        },
        function (instance, next) {
            if (!user.groups || user.groups.lengh <= 0) {
                return next(null, instance);
            }

            let userGrps = [];

            user.groups.forEach(function (grp) {

                if (!grp.id) return;

                userGrps.push({
                    memberId: instance.id,
                    groupId: grp.id
                });
            });

            app.models.MemberGroup.create(userGrps, function (err) {
                next(err, instance);
            });

        }
    ], function (err, instance) {
        if (err) console.error('ERROR [%s]: %s', err.name, err.message);
        let error = err ? errorUtil.createAppError(errors.SERVER_GET_PROBLEM) : null;
        callback(error, instance);
    });
};

exports.createUsers = function (users, callback) {

    let userObjs = [];

    async.eachSeries(users, function (user, next) {

        exports.createUser(user, function (err, instance) {
            if (err || !instance) return next(err, instance);
            userObjs.push(instance);
            next(null, instance);
        });

    }, function (err) {
        callback(err, userObjs);
    });
};


exports.getUserById = function (userId, callback) {
    app.models.Member.findByUserId(userId, function (err, userObj) {
        if (err) return callback(err);
        callback(null, userObj);
    });
};

exports.getUserByUsername = function (username, callback) {

    app.models.Member.findByUsername(username, function (err, userObj) {
        if (err) return callback(err);
        callback(null, userObj);
    });
};

exports.getUserByUsernameWithPermissions = function (username, callback) {

    app.models.Member.findByUsernameWithPermissions(username, function (err, userObj) {
        if (err) return callback(err);
        callback(null, userObj);
    });

};

exports.login = function (user, callback) {

    async.waterfall([
        function (next) {
            app.models.Member.findByUsername(user.username, true, function (err, userObj) {

                if (err) return next(err);

                let password = md5(user.password);

                if (userObj.password != password) {
                    return next(errorUtil.createAppError(errors.MEMBER_INVALID_PASSWORD));
                }

                next(null, userObj);
            });
        },
        function (user, next) {
            // get User Secret Key
            redis.getSecretKey(user.username, function (err, value) {

                if (!err) return next(null, user, value);

                if (err.code != errors.MISSING_REDIS_KEY.code) {
                    return next(err);
                }

                // Generate Secret Key
                let secret = token.generateSecretKey(user.username);

                // Set to redis
                redis.setSecretKey(user.username, secret);

                return next(null, user, secret);

            });
        },
        function (user, secret, next) {
            let tokenKey = token.generate({username: user.username, fullName: user.fullName}, secret);

            token.getSignature(tokenKey, function (err, sign) {
                next(err, user, secret, tokenKey, sign);
            });

        },
        function (user, secret, tokenKey, sign, next) {
            redis.setSecretKeyBySignature(sign, JSON.stringify({username: user.username, secret: secret}));
            next(null, tokenKey);
        }
    ], function (err, tokenKey) {
        callback(err, tokenKey);
    });

};

exports.resetPassword = function (email, callback) {
    async.waterfall([
        function (next) {
            // find user by email
            app.models.Member.findByEmail(email, function (err, user) {
                if (err) {
                    return callback(errorUtil.createAppError(errors.MEMBER_EMAIL_NOT_FOUND));
                }
                return next(null, user);
            });
        },
        function (user, next) {
            // generate new random password
            var plainPassword = userConverter.generateNewPassword();
            user.password = md5(plainPassword);
            return next(null, user, plainPassword);
        },
        function (user, plainPassword, next) {
            // save password to DB
            user.updateAttribute(constant.PASSWORD_FIELD, user.password, function (err, updatedUser) {
                if (err) return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
                else return next(null, updatedUser, plainPassword);
            })
        },
        function (updatedUser, plainPassword, next) {
            // send notification email to client
            var senderInfo = appConfig.getMailSenderInfo();
            var mailOptions = {
                from: senderInfo.sender,
                to: updatedUser.email,
                subject: senderInfo.subject,
                text: senderInfo.text + plainPassword
            };

            mailSender.sendMail(mailOptions, function (err, info) {
                if (err) return callback(err);
                else return next(null, updatedUser);
            });
        }
    ], function (err, updatedUser) {
        callback(err, updatedUser);
    });
};
