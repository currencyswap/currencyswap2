'use strict';

const stringUtil = require('./libs/utilities/string-util');
var exports = module.exports;

const Routes = {
    ROOT : '/',
    HOME : '/',
    CLIENT: '/app/',
    CONFIG: '/config/',
    API : '/api',
    API_HELLO : '/api/hello',
    API_AUTHENTICATE : '/api/authenticate',
    API_USERS : '/api/users',    
    API_USERS_ID : '/api/users/:id',
    API_ORDERS : '/api/orders',
    API_ORDERS_ID : '/api/orders/:id',
    API_MY_PROFILE: '/api/profile',
    API_PERMISSIONS: '/api/permissions'
};

exports.getRoute = function ( val ) {
    return stringUtil.getValue( val, Routes );
};

exports.routes = Routes;
