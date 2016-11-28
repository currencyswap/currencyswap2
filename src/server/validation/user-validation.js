'use strict';

var exports = module.exports;
var errorUtils = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var validator = require('validator');

exports.validateRequestObject = function (clientUserObj) {
    exports.validateUsername(clientUserObj.username);
    exports.validatePassword(clientUserObj.password);
    exports.validateEmail(clientUserObj.email);
    exports.validateFullName(clientUserObj.fullName);
    exports.validateBirthDay(clientUserObj.birthday);
    exports.validateCellphone(clientUserObj.cellphone);
    exports.validateProfession(clientUserObj.profession);
    exports.validateNationalId(clientUserObj.nationalId);
};

exports.validateUsername = function (username) {
    if (!username) {
        throw errorUtils.createAppError(errors.REQUEST_NO_USERNAME);
    }

    if (typeof username !== 'string') {
        throw errorUtils.createAppError(errors.USERNAME_IS_NOT_STRING);
    }

    if (username.length > 64) {
        throw errorUtil.createAppError(errors.USERNAME_EXCEED_MAX_LENGTH);
    }
};

exports.validatePassword = function (password) {
    if (!password) {
        throw errorUtils.createAppError(errors.REQUEST_NO_PASSWORD);
    }

    if (typeof password !== 'string') {
        throw errorUtils.createAppError(errors.PASSWORD_IS_NOT_STRING);
    }

    if (password.length > 64) {
        throw errorUtil.createAppError(errors.PASSWORD_EXCEED_MAX_LENGTH);
    }
};

exports.validateEmail = function (email) {
    if (!email) {
        throw errorUtils.createAppError(errors.REQUEST_NO_EMAIL);
    }

    if (typeof email !== 'string') {
        throw errorUtils.createAppError(errors.EMAIL_IS_NOT_STRING);
    }

    if (email.length > 64) {
        throw errorUtil.createAppError(errors.EMAIL_EXCEED_MAX_LENGTH);
    }

    if (!validator.isEmail(email)) {
        throw errorUtil.createAppError(errors.EMAIL_IS_INVALID);
    }
};

exports.validateFullName = function (fullName) {
    if (fullName) {
        if (typeof fullName !== 'string') {
            throw errorUtils.createAppError(errors.FULLNAME_IS_NOT_STRING);
        }

        if (fullName.length > 128) {
            throw errorUtil.createAppError(errors.FULLNAME_EXCEED_MAX_LENGTH);
        }
    }
};

exports.validateBirthDay = function(birthDay) {
    if (birthDay) {
        if (!validator.isDate(birthDay)) {
            throw errorUtil.createAppError(errors.BIRTHDAY_IS_NOT_DATE_TYPE);
        }
    }
};

exports.validateCellphone = function (cellphone) {
    if (cellphone) {
        if (cellphone.length > 32) {
            throw errorUtil.createAppError(errors.CELLPHONE_EXCEED_MAX_LENGTH);
        }
    }
};

exports.validateProfession = function (profession) {
    if (profession) {
        if (profession.length > 256) {
            throw errorUtil.createAppError(errors.PROFESSION_EXCEED_MAX_LENGTH);
        }
    }
};

exports.validateNationalId = function (nationalId) {
    if (nationalId) {
        if (nationalId.length > 128) {
            throw errorUtil.createAppError(errors.NATIONALID_EXCEED_MAX_LENGTH);
        }
    }
};

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

};

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

};
