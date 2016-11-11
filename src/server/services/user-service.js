'use strict';

var exports = module.exports;
var md5 = require('js-md5');
var errorUtil = require('../libs/errors/error-util');
var stringUtil = require('../libs/utilities/string-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var redis = require('../libs/redis');
var token = require('../libs/token');
var async = require('async');
var mailSender = require('../libs/mail-sender');
var constant = require('../libs/constants/constants');
var appConfig = require('../libs/app-config');
var crypto = require('crypto');
var routes = require('../routes').routes;
var os = require('os');
var userConverter = require('../converters/user-converter');
var groupService = require('../services/group-service');

exports.createUser = function (user, callback) {
    user.password = md5(user.password);

    async.waterfall([
        function (next) {
            app.models.Member.beginTransaction({isolationLevel: app.models.Member.Transaction.READ_COMMITTED}, function (err, tx) {
                if (err) {
                    console.log('Error on transaction initialization');
                    return next(errorUtil.createAppError(errors.TRANSACTION_INIT_FAIL));
                } else {
                    var txObject = {transaction: tx};
                    return next(null, txObject)
                }
            })
        },
        function (txObject, next) {
            app.models.Member.create(user, txObject, function (err, instance) {
                if (err) {
                    console.log('Error on saving User to DB');
                    return next(errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_TO_DB));
                } else {
                    return next(null, txObject, instance)
                }
                //next(err, txObject, instance);
            });
        },
        function (txObject, instance, next) {

            if (!user.addresses || user.addresses.lengh <= 0) {
                return next(null, txObject, instance);
            }

            user.addresses.forEach(function (addr) {
                addr.memberId = instance.id;
            });

            instance.addresses.create(user.addresses, txObject, function (err) {
                if (err) {
                    console.log('Error on saving addresses for user');
                    return next(errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_ADDR_TO_DB));
                } else {

                }
                next(err, txObject, instance);
            });

        },
        function (txObject, instance, next) {
            if (!user.groups || user.groups.lengh <= 0) {
                return next(null, txObject, instance);
            }

            var userGrps = [];

            user.groups.forEach(function (grp) {
                if (!grp.id) return;

                userGrps.push({
                    memberId: instance.id,
                    groupId: grp.id
                });
            });

            app.models.MemberGroup.create(userGrps, txObject, function (err) {
                if (err) {
                    console.log('Error on saving User Groups to DB');
                    return next(errorUtil.createAppError(errors.COULD_NOT_SAVE_USER_GR_TO_DB));
                } else {
                    return next(null, txObject, instance)
                }
            });

        }
    ], function (err, txObject, instance) {
        if (err) {
            txObject.transaction.rollback(function (rollbackErr) {
                if (rollbackErr) {
                    console.log('Fail to rollback transaction');
                    return callback(errorUtil.createAppError(errors.ERROR_TX_ROLLBACK));
                } else {
                    return callback(err);
                }
            });
        } else {
            txObject.transaction.commit(function (commitErr) {
                if (commitErr) {
                    console.log('Fail to commit transaction');
                    return callback(errorUtil.createAppError(errors.ERROR_TX_COMMIT));
                }
                else return callback(null, instance);
            });
        }
    });
};

exports.createUsers = function (users, callback) {

    var userObjs = [];

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
        if (err) {
            return callback(err);
        }
        return callback(null, userObj);
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

                var password = md5(user.password);

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
                var secret = token.generateSecretKey(user.username);

                // Set to redis
                redis.setSecretKey(user.username, secret);
                return next(null, user, secret);
            });
        },
        function (user, secret, next) {
            var tokenKey = token.generate({username: user.username, fullName: user.fullName}, secret);

            token.getSignature(tokenKey, function (err, sign) {
                next(err, user, secret, tokenKey, sign);
            });

        },
        function (user, secret, tokenKey, sign, next) {
            redis.setSecretKeyBySignature(sign, JSON.stringify({username: user.username, secret: secret}));
            return next(null, tokenKey);
        }
    ], function (err, tokenKey) {
        callback(err, tokenKey);
    });

};

exports.verifyResetPwdInfo = function (email, callback) {
    async.waterfall([
        function (next) {
            // find user by email
            app.models.Member.findByEmail(email, function (err, user) {
                if (err) {
                    return next(errorUtil.createAppError(errors.MEMBER_EMAIL_NOT_FOUND));
                }
                return next(null, email);
            });
        },
        function (email, next) {
            // generate reset password code
            exports.generateRandomString(function (err, randomString) {
                if (err) return next(err);
                else {
                    return next(null, randomString, email);
                }
            });
        },
        function (randomString, email, next) {
            redis.set(email, randomString, constant.ONE_DAY_IN_SECONDS);
            return next(null, randomString, email);
        },
        function (randomString, email, next) {
            // send notification email to client
            var senderInfo = appConfig.getMailSenderInfo();
            var mailOptions = {
                from: senderInfo.sender,
                to: email,
                subject: senderInfo.subject,
                text: 'Please click to below link to reset your password'
                        + '\n' + 'Your reset password URL: ' + exports.constructResetUrl(randomString, email)
                        + '\n'
                        + '\n' + 'Thanks and best regards'
                        + '\n' + 'Currency Swap'
            };

            mailSender.sendMail(mailOptions, function (err, info) {
                if (err) return callback(err);
                else {
                    return next(null);
                }
            });
        }
    ], function (err, updatedUser) {
        callback(err, updatedUser);
    });
};

exports.resetPassword = function (newPassword, requestResetCode, callback) {
    async.waterfall([
        function (next) {
            var emailAndRandomString = exports.extractEmailAndRandomString(requestResetCode);
            return next (null, newPassword, emailAndRandomString)
        },
        function (newPassword, emailAndRandomString, next) {
            redis.checkResetCode(emailAndRandomString.email, emailAndRandomString.randomString, function (err, response) {
                if (err) return next(err);
                else return next(null, emailAndRandomString.email, newPassword);
            });
        },
        function (email, newPassword, next) {
            exports.updatePassword(email, newPassword, function (err) {
                if (err) return next (err);
                else return next (null);
            })
        }
    ], function (err) {
        callback(err);
    });
};

exports.generateRandomString = function (callback) {
    crypto.randomBytes(16, function (err, buf) {
        if (err) return callback(err);
        else return callback(null, buf.toString('hex'));

    });
};

exports.constructResetUrl = function (randomString, email) {
    var plainResetCode = email + constant.RESET_CODE_DELIMITER + randomString;
    var encryptedResetCode = stringUtil.encryptString(plainResetCode, constant.ENCRYPTION_ALGORITHM, constant.ENCRYPTION_PWD, 'utf8', 'hex');

    return app.get('url').replace(/\/$/, '')
        + constant.SLASH
        + constant.HASHTAG_AND_EXCLAMATION
        + constant.CLIENT_RESET_PWD_PATH
        + constant.QUESTION_MARK + constant.RESET_CODE_PARAM
        + '='
        + encryptedResetCode;
};

exports.validateResetCode = function (redisResetCode, requestResetCode) {
    return (redisResetCode === requestResetCode);
};

exports.updatePassword = function (email, newPwd, callback) {
    async.waterfall([
        function (next) {
            app.models.Member.findByEmail(email, function (err, user) {
                if (err) return next(errorUtil.createAppError(errors.MEMBER_EMAIL_NOT_FOUND));
                else return next (null, user, newPwd);
            })
        },
        function (user, newPwd, next) {
            var md5Password = md5(newPwd);
            user.updateAttribute(constant.PASSWORD_FIELD, md5Password, function (err, updatedUser) {
                if (err) return next(errorUtil.createAppError(errors.COULD_NOT_UPDATE_USER_PWD));
                else return next(null);
            })
        }
    ], function (err) {
        callback(err)
    });
};

exports.createUserTransaction = function (callback) {
    app.models.Member.beginTransaction (function (err, tx) {
        if (err) return callback(err);
        else return callback(null, tx);
    });
};

exports.registerUser = function (newUser, callback) {
    async.waterfall([
        function (next) {
            groupService.findGroupByName(newUser.group, function (err, group) {
                if (err) {
                    return next(err);
                } else {
                    newUser.groups = [{
                        id: group.id,
                        name: group.name
                    }];
                    return next(null, newUser);
                }

            })
        },
        function (newUser, next) {
            exports.getUserByUsername(newUser.username, function (err, user) {
                if (err) {
                    if (err.code === errorUtil.createAppError(errors.MEMBER_INVALID_USERNAME).code) {
                        return next(null, newUser);
                    } else {
                        return next(err);
                    }
                } else {
                    return next(errorUtil.createAppError(errors.USER_NAME_EXISTED));
                }
            })
        },
        function (newUser, next) {
            app.models.Member.findByEmail(newUser.email, function (err, user) {
                if (err) {
                    if (err.code === errorUtil.createAppError(errors.MEMBER_EMAIL_NOT_FOUND).code) {
                        return next(null, newUser);
                    } else {
                        return next (err);
                    }
                } else {
                    return next(errorUtil.createAppError(errors.EMAIL_EXISTED));
                }
            })
        },
        function (user, next) {
            exports.createUser(user, function (err, savedUser) {
                if (err) {
                    return next(err);
                }
                else return next(null, savedUser);
            })
        }
    ], function (err, savedUser) {
        callback(err, savedUser);
    });
};

exports.findAllUsers = function (callback) {
    app.models.Member.findAll(function (err, users) {
        if (err) return callback(err);
        else return callback(null, users);
    })
};

exports.extractEmailAndRandomString = function (requestResetCode) {
    var decryptedString = stringUtil.decryptString(requestResetCode, constant.ENCRYPTION_ALGORITHM, constant.ENCRYPTION_PWD, 'hex', 'utf8');
    var email = decryptedString.split(constant.RESET_CODE_DELIMITER)[0];
    var randomString = decryptedString.split(constant.RESET_CODE_DELIMITER)[1];

    return {
        email: email,
        randomString: randomString
    }
};

exports.getUserDetail = function (userId, callback) {
    app.models.Member.findUserDetailWithEmail(userId, function (err, user) {
        if (err) return callback(err);
        else return callback(null, user)
    })
};
