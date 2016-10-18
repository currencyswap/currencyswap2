'use strict';

const appConfig = require('../../app-config');
const error = require('./errors/errors');

var AppError = require('./errors/app-error');
var errorUtil = require('./errors/error-util');

var exports = {};

exports.DATE_FORMAT = 'yyyy-mm-dd';
exports.DATETIME_FORMAT = 'yyyy-mm-dd HH:MM:ss';
exports.DATETIME_MS_FORMAT = 'yyyy-mm-ss HH:MM:ss L';
exports.TIME_FORMAT = 'HH:MM:ss';

exports.getDateFormat = function () {
    let dateFormat = appConfig.dateFormat; 

    if ( dateFormat ) return dateFormat;

    return {
        datetime : exports.DATETIME_FORMAT,
        date : exports.DATE_FORMAT,
        time : exports.TIME_FORMAT
    };
}
;
exports.getTitle = function () {
    return appConfig.title ? appConfig.title : ''; 
};

exports.getRedis = function () {
    var redisParams = {
        host: 'localhost',
        port: 6379,
        db: 10,
        pass: '',
        ttl: 3600,
        disableTTL: false,
        prefix: 'nodejs-app:'
    };

    if (appConfig.redis === undefined) {
        let message = errorUtil.getMessage( error.INVALID_REDIS_PARAMS.message );        
        throw new AppError( message , error.INVALID_REDIS_PARAMS.code );
    }

    if (appConfig.redis.host !== undefined &&
        appConfig.redis.host !== null &&
        appConfig.redis.host.length > 0) {
        redisParams.host = appConfig.redis.host;
    }

    if (appConfig.redis.port !== undefined &&
        appConfig.redis.port !== null) {
        redisParams.port = appConfig.redis.port;
    }

    if (appConfig.redis.db !== undefined &&
        appConfig.redis.db !== null) {
        redisParams.db = appConfig.redis.db;
    }

    if (appConfig.redis.pass !== undefined &&
        appConfig.redis.pass !== null &&
        appConfig.redis.pass.length > 0) {
        redisParams.pass = appConfig.redis.pass;
    }

    if (appConfig.redis.ttl !== undefined &&
        appConfig.redis.ttl !== null) {
        redisParams.ttl = appConfig.redis.ttl;
    }

    if (appConfig.redis.disableTTL !== undefined &&
        appConfig.redis.disableTTL !== null) {
        redisParams.disableTTL = appConfig.redis.disableTTL;
    }

    if (appConfig.redis.prefix !== undefined &&
        appConfig.redis.prefix !== null &&
        appConfig.redis.prefix.length > 0) {
        redisParams.prefix = appConfig.redis.prefix;
    }

    return redisParams;
};

exports.getTokenExpired = function () {
    return appConfig.tokenExpired;
};

exports.getLogsFolder = function () {
    return appConfig.logs;
};

exports.getSMTP = function () {
    return appConfig.smtp;
};


module.exports = exports;