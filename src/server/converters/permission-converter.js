'use strict';

var exports = module.exports;

exports.getPermissionsFormUser = function (user) {

    let userObj = null;
    let permissions = {};

    if (typeof user.toJSON == 'function') {
        userObj = user.toJSON();
    } else {
        userObj = user;
    }

    userObj.groups.forEach(function (group) {

        group.permissions.forEach(function (permission) {

            // if (permissions.indexOf(permission.name) < 0) {
            //     permissions.push(permission.name);
            // }

            permissions[ permission.key ] = permission.name;

        });

    });

    return permissions;
};
