'use strict';

var AppError = require('../libs/errors/app-error');
var errors = require('../libs/errors/errors');
var stringUtil = require('../libs/utilities/string-util');
var messages = require('../messages/messages');
var constant = require('../libs/constants/constants');
var userValidation = require('../validation/user-validation');
var util = require('util');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', function (req, res) {
        console.log('invite controller');
        var inviter = req.body.currentUser;
        var registrationEmail = req.body.regEmail;
        //step 1: validate email and validate inviter
        try {
            userValidation.validateInviteRequest(inviter, registrationEmail);
        } catch (err) {
            return res.status(constant.HTTP_FAILURE_CODE).send(err);
        }
        //step 2: check if email is existed in DB, if not continue

        //step 3: save to redis with key: 'INVITATION:username' value: 'registration email'
        //step 4: generate registration link in form http://localhost:3000/#!/register?inviter=username&regEmail=email
        //step 5: send link to email

        res.status(200).send({message: 'SUCCESS'});
    });

    return router;
};


