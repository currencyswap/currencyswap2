'use strict';

var exports = module.exports;
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var async = require('async');
var appConfig = require('../libs/app-config');
var dateFormat = require('dateformat');

exports.getPermissionsFormUser = function (user) {

    let userObj = null;
    let permissions = [];

    if (typeof user.toJSON == 'function') {
        userObj = user.toJSON();
    } else {
        userObj = user;
    }

    userObj.groups.forEach(function (group) {

        group.permissions.forEach(function (permission) {

            if (permissions.indexOf(permission.name) < 0) {
                permissions.push(permission.name);
            }

        });

    });

    return permissions;
}
