'use strict';

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var userConverter = require('../converters/user-converter');

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        userService.findAllUsers(function (err, users) {
            if (err) return res.status(299).send(err);
            else return res.status(200).send(users)
        })
    });

    router.get('/:id', function (req, res) {
        var userId = req.params.id;

        if ( !userId ) {

            var err = errorUtil.createAppError( errors.MEMBER_NO_USERID );

            return res.status(403).send( errorUtil.getResponseError( err ) );
        }

        userService.getUserById( userId, function (err, userObj) {

            if (err) {
                var code = err.code == errors.SERVER_GET_PROBLEM ? 500 : 406;
                return res.status(code).send( errorUtil.getResponseError( err ) );
            }

            return res.status(200).send( userConverter.convertUserToUserJSON( userObj ));

        });
    });

    return router;
};
