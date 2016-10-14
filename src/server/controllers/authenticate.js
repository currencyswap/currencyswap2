'use strict';

var AppError = require('../libs/errors/app-error');

var stringUtil = require('../libs/utilities/string-util');
var httpHeaderUtil = require('../libs/utilities/http-header-util');
var userValidation = require('../validation/user-validation');
var userService = require('../services/user-service');
var async = require( 'async' );
module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {

        async.waterfall( [
            function ( next ) {
                httpHeaderUtil.getAuthBasicHeader( req, next );
            },
            function ( user, next ) {
                userValidation.validateUsernamePass( user , function ( err ) {
                    next( err, user );
                });
            },
            function ( user, next ) {

                userService.login( user, function ( err, tokenKey ) {
                    next( err, tokenKey );
                });
            }
        ], function ( err, tokenKey ) {

            if ( err ) {
                return res.status( 401 ).send( err.message );
            }
            
            return res.status( 200 ).send( { 
                token : tokenKey
            });

        });

    });

    return router;
}
