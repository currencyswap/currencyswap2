'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var util = require('util');
var constants = require('../libs/constants/constants');

module.exports = function (Member) {
    Member.observe('after save', function (ctx, next) {

        if (!ctx.instance) {
            return next();
        }

        // redis.removeUserFromRedis( ctx.instance.username );

        next();
    });

    Member.findByUserId = function (userId, isActivated, callback) {

        if (typeof isActivated == 'function') {
            callback = isActivated;
            isActivated = null;
        }

        var where = {
            id: userId
        };

        if (isActivated !== undefined && isActivated !== null) {
            where.isActivated = isActivated;
        }

        var includeGroups = {
            relation: 'groups'
        };

        var includeAddresses = {
            relation: 'addresses'
        };

        var filter = {
            where: where,
            include: [includeGroups, includeAddresses]
        };

        Member.findOne(filter, function (err, user) {

            if (err) {
                return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            }

            if (!user) {
                var appError = errorUtil.createAppError(errors.MEMBER_INVALID_USERID);
                appError.message = util.format(appError.message, userId);
                return callback(appError);
            }

            callback(null, user);
        });
    };

    Member.findByUsername = function (username, isActivated, callback) {

        if (typeof isActivated == 'function') {
            callback = isActivated;
            isActivated = null;
        }

        var where = {
            username: username
        };

        if (isActivated !== undefined && isActivated !== null) {
            where.isActivated = isActivated;
        }

        var includeGroups = {
            relation: 'groups'
        };

        var includeAddresses = {
            relation: 'addresses'
        };

        var filter = {
            where: where,
            include: [includeGroups, includeAddresses]
        };

        Member.findOne(filter, function (err, user) {

            if (err) {
                return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            }

            if (!user) {
                var appError = errorUtil.createAppError(errors.MEMBER_INVALID_USERNAME);
                appError.message = util.format(appError.message, username);
                return callback(appError);
            }

            callback(null, user);
        });
    };

    Member.findByUsernameWithPermissions = function (username, callback) {
        var where = {
            username: username,
            isActivated: true
        };

        var includeGroups = {
            relation: 'groups',
            scope: {
                include: 'permissions'
            }
        };

        var filter = {
            where: where,
            include: includeGroups
        };

        Member.findOne(filter, function (err, user) {

            if (err) {
                return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            }

            if (!user) {
                var appError = errorUtil.createAppError(errors.MEMBER_INVALID_USERNAME);
                appError.message = util.format(appError.message, username);
                return callback(appError);
            }

            callback(null, user);
        });
    };

    Member.findByEmail = function (email, callback) {
        var where = {
            email: email
        };

        var filter = {
            where: where
        };
        Member.findOne(filter, function (err, user) {

            if (err) {
                return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            }

            if (!user) {
                return callback(errorUtil.createAppError(errors.MEMBER_EMAIL_NOT_FOUND));
            }

            callback(null, user);
        });
    };

    Member.findAll = function (callback) {
        Member.find(function (err, users) {
            if (err) return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            else {
                if (!users || users.length < 0) return callback(errorUtil.createAppError(errors.NO_USER_FOUND_IN_DB));
                else return callback(null, users);
            }
        });
    };

    Member.findUserDetailWithEmail = function (userId, callback) {
        var where = {
            id: userId
        };

        var includeAddress = {
            relation: 'addresses'
        };

        var filter = {
            where: where,
            include: includeAddress
        };

        Member.findOne(filter, function (err, user) {
            if (err) return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            else {
                if (!user) return callback(errorUtil.createAppError(errors.NO_USER_FOUND_IN_DB));
                return callback(null, user);
            }
        })
    }
};
