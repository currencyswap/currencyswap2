'use strict';

var exports = module.exports;
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var async = require('async');

exports.createGroups = function ( groups, callback ) {
    app.models.Group.create( groups, function (err, groups ) {
        
        if ( err ) {
            console.error('ERROR : %s', err );
            err = errorUtil.createAppError(errors.SERVER_GET_PROBLEM);
        }

        callback( err, groups);

    });
};

exports.setupGroupPermission = function ( pairs, callback ) {
    app.models.GroupPermission.create( pairs, function (err, pairs ) {

        if ( err ) {
            console.error('ERROR : %s', err );
            err = errorUtil.createAppError(errors.SERVER_GET_PROBLEM);
        }

        callback( err, pairs);

    });
};

exports.setupMemberGroup = function ( pairs, callback ) {
    app.models.MemberGroup.create( pairs, function (err, pairs ) {

        if ( err ) {
            console.error('ERROR : %s', err );
            err = errorUtil.createAppError(errors.SERVER_GET_PROBLEM);
        }

        callback( err, pairs);

    });
};
