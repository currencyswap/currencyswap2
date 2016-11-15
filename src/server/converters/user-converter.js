'use strict';

var exports = module.exports;
var appConfig = require('../libs/app-config');
var dateFormat = require('dateformat');
var constant = require('../libs/constants/constants');

exports.convertUserToUserJSON = function (user) {

    let userJSON = user.toJSON();

    let userObj = {
        id: userJSON.id,
        username: userJSON.username,
        email: userJSON.email,
        fullName: userJSON.fullName,
        birthday: userJSON.birthday ? dateFormat(userJSON.birthday, appConfig.DATE_FORMAT) : null,
        expiredDate: userJSON.expiredDate ? dateFormat(userJSON.expiredDate, appConfig.DATE_FORMAT) : null,
        isBlocked: userJSON.isBlocked,
        isActivated: userJSON.isActivated,
        addresses: []
    };

    if (userJSON.addresses && userJSON.addresses.length > 0) {

        userJSON.addresses.forEach(function (address) {

            userObj.addresses.push({
                id: address.id,
                address: address.address,
                city: address.city,
                state: address.state,
                country: address.country,
                postcode: address.postcode
            });

        });
    }

    if (userJSON.groups && userJSON.groups.length > 0) {
        userObj.groups = [];
        userJSON.groups.forEach(function (group) {

            userObj.groups.push({
                id: group.id,
                name: group.name
            });

        });
    }

    return userObj;

};

exports.convertUserData = function (requestUser) {
    var resultUser = {};

    // Required field, can not submit without it.
    resultUser.username = requestUser.username;
    resultUser.password = requestUser.password;
    resultUser.email = requestUser.email;
    resultUser.addresses = [];

    //Default for new registration user
    //resultUser.group = "Blocked User";
    resultUser.group = "Blocked User";
    resultUser.status = constant.USER_STATUSES.NEW;
    resultUser.expiredDate = new Date(Date.now()).toISOString();
    resultUser.registeredDate = new Date(Date.now()).toISOString();

    if (requestUser.fullName) {
        resultUser.fullName = requestUser.fullName;
    }

    if (requestUser.birthday) {
        resultUser.birthday = requestUser.birthday;
    }

    if (requestUser.cellphone) {
        resultUser.cellphone = requestUser.cellphone;
    }

    if (requestUser.profession) {
        resultUser.profession = requestUser.profession;
    }

    if (requestUser.addresses) {
        requestUser.addresses.forEach(function (address) {
            if (address.address && address.city && address.postcode && address.country) resultUser.addresses.push(requestUser.addresses);
        });
    }

    if (requestUser.profession) resultUser.profession = requestUser.profession;

    return resultUser;
};