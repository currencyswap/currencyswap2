'use strict';

var exports = module.exports;
var appConfig = require('../libs/app-config');
var dateFormat = require('dateformat');

exports.convertUserToUserJSON = function (user) {
    return {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday ? dateFormat(user.birthday, appConfig.DATE_FORMAT) : null
    }

};
