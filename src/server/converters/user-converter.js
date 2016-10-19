'use strict';

var exports = module.exports;
var appConfig = require('../libs/app-config');
var dateFormat = require('dateformat');

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
