'use strict';

var exports = module.exports;
var stringUtil = require('../utilities/string-util');
var AppError = require('./app-error');

exports.getMessage = function ( errorMessageLabel ) {
    return stringUtil.getMessage( errorMessageLabel );
}

exports.createAppError = function ( error ) {
    let message = stringUtil.getMessage( error.message );
    return new AppError( message, error.code );
}
