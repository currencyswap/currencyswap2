'use strict';

var exports = module.exports;
const errors = require('../errors/errors');
var errorUtil = require('../errors/error-util');
var stringUtil = require('./string-util');
var async = require('async');
const BASIC_HEADER = 'Basic ';
const BEARER_HEADER = 'Bearer ';

var getHeaderContent = function ( headerStr, headerType, callback ) {
    
    let idx = headerStr.indexOf( headerType );

    if ( idx < 0 ) return callback( errorUtil.createAppError( errors.INVALID_AUTHORIZATION_HEADER ) );

    callback( null, headerStr.substring( headerType.length ).trim() );
};

var getAuthHeaderContent = function ( request, type, callback ) {
    async.waterfall( [
        function ( next ) {
            exports.getAuthorizationHeader( request, function ( err, headerStr ) {
                if ( err ) return next( err );
                next( null, headerStr );
            });
        },
        function ( headerStr, next ) {
            getHeaderContent( headerStr, type, next );
        }
    ], callback );
};

exports.getAuthorizationHeader = function ( request, callback ) {

    if ( ! request || ! request.headers ) {
        return callback( errorUtil.createAppError( errors.INVALID_HTTP_HEADER ) ); 
    }

    if ( !request.headers.authorization ) {
        return callback( errorUtil.createAppError( errors.INVALID_AUTHORIZATION_HEADER ) ); 
    }

    callback( null, request.headers.authorization );
};

exports.getAuthBasicHeader = function ( request, callback ) {

    getAuthHeaderContent( request, BASIC_HEADER, function ( err, headerStr ) {

        if ( err ) return callback( err );

        let decodeStr = stringUtil.decodeBase64( headerStr );

        let arr = decodeStr.split(':');

        if ( arr.length < 2 ) {
            return callback( errorUtil.createAppError( errors.INVALID_AUTHORIZATION_HEADER ) );
        }

        let username = arr[0];
        let password = decodeStr.substring( username.length + 1 );

        callback( null , {
            username : username,
            password : password            
        });
    });

};

exports.getAuthBearerHeader = function ( request, callback ) {
    getAuthHeaderContent( request, BEARER_HEADER, function ( err, headerStr ) {
        if ( err ) return callback( err );
        return callback( null, headerStr );
    });
};

