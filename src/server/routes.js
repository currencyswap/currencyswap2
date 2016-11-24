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
    API_ORDERS_SWAPPING : '/api/orders/swapping',
    API_ORDERS_CONFIRMED : '/api/orders/confirmed',
    API_ORDERS_SUBMITTED : '/api/orders/submitted',
    API_ORDERS_HISTORY : '/api/orders/history',
    API_MY_PROFILE: '/api/profile',
    API_PERMISSIONS: '/api/permissions',
    API_SUPPORTS : '/api/supports',
    API_SUPPORTS_CREATOR: '/api/supports/creator',
    API_FORGOT_PASSWORD_VERIFY: '/api/forgotpassword/verify',
    API_FORGOT_PASSWORD_RESET: '/api/forgotpassword/reset',
    API_REGISTER: '/api/register'
};

exports.getRoute = function ( val ) {
    return stringUtil.getValue( val, Routes );
};

exports.routes = Routes;
