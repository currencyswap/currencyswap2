'use strict';

var exports = module.exports;
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');

exports.validateUsernamePass = function( user, callback ) {

    if ( user === undefined || user === null ) {
        return callback( errorUtil.createAppError( errors.INVALID_AUTHORIZATION_HEADER ));  
    }

    if ( user.username === undefined ) {
        return callback( errorUtil.createAppError( errors.MEMBER_NO_USERNAME ));  
    }

    if ( user.password === undefined ) {
        return callback( errorUtil.createAppError( errors.MEMBER_NO_PASSWORD ));        
    }

    callback( null );

}

exports.validateUserPass = function( user, callback ) {

    if ( user.username === undefined ) {
        return callback( errorUtil.createAppError( errors.MEMBER_NO_USERNAME ));  
    }

    if ( user.password === undefined ) {
        return callback( errorUtil.createAppError( errors.MEMBER_NO_PASSWORD ));        
    }

    if ( user.email === undefined ) {
        return callback( errorUtil.createAppError( errors.MEMBER_NO_EMAIL ));
    }

    callback( null );

}
