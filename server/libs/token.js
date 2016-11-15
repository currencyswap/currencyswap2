'use strict';

var exports = module.exports;
const errors = require('./errors/errors');
var errorUtil = require('./errors/error-util');

var appConfig = require('./app-config');
var jwt = require('jsonwebtoken');
var md5 = require('js-md5');
const dateFormat = require('dateformat');
const util = require('util');
const HS256 = 'HS256';
const TOKEN_PARTS_AMT = 3;

exports.generateSecretKey = function (prefix) {
    let dateStr = dateFormat(new Date(), appConfig.DATETIME_MS_FORMAT );

    if (prefix === undefined) {
        return md5(util.format('%s', dateStr));
    } else {
        return md5(util.format('%s %s', prefix, dateStr));
    }
};

exports.generate = function (obj, secret) {
    return jwt.sign(obj, secret, { algorithm: HS256, expiresIn: appConfig.getTokenExpired() });
};

exports.verify = function (tokenKey, secret, callback) {
    try {
        return jwt.verify(tokenKey, secret, { algorithm: HS256 }, callback);
    } catch (err) {
        return callback(err);
    }
};

exports.getSignature = function (tokenKey, callback) {
    let parts = tokenKey.split('.');

    if (parts.length != TOKEN_PARTS_AMT) {
        return callback(errorUtil.createAppError(errors.INVALID_TOKEN_API_KEY));
    }

    return callback( null, parts[parts.length - 1] );
};
