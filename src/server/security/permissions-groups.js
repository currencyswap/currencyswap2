'use strict';

const stringUtil = require('../libs/utilities/string-util');
var exports = module.exports;

const Permissions = {
    VIEW_OWN_ORDERS: 'View own orders',
    MAINTAIN_OWN_ORDERS: 'Maintain own orders',
    VIEW_ALL_ORDERS: 'View all orders',
    EDIT_PROFILE: 'Edit Profile',
    USER_MANAGEMENT: 'User Management',
    VIEW_OWN_NOTIFICATIONS: 'View own notifications',
    VIEW_OWN_PERMISSION: 'View own permissions'
};

const Groups = {
    ADMIN: 'Admin',
    USER: 'User'
};

exports.Permissions = Permissions;
exports.Groups = Groups;

exports.getPermission = function (val) {
    return stringUtil.getValue(val, Permissions);
};

exports.getGroup = function (val) {
    return stringUtil.getValue(val, Groups);
};

exports.getPermissionByName = function (name) {

    for (let key in Permissions) {
        if (name == key) {
            return key;
        }
    }

    return null;
};
