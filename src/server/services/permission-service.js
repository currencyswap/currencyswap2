'use strict';

var exports = module.exports;
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var async = require('async');

exports.createPermissions = function ( permissions, callback ) {
    app.models.Permission.create( permissions, function (err, permissions ) {

        if ( err ) {
            console.error('ERROR : %s', err );
            err = errorUtil.createAppError(errors.SERVER_GET_PROBLEM);
        }

        callback( err, permissions);

    });
};
