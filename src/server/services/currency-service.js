'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');

exports.create = function (currencies, callback) {
    app.models.Currency.create(currencies, function (err, objs) {
        if (err) console.error('ERROR [%s]: %s', err.name, err.message);
        let error = err ? errorUtil.createAppError(errors.SERVER_GET_PROBLEM) : null;
        
        callback(error, objs);

    });
};
