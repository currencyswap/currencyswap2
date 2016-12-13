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
    API_CURRENCIES : '/api/currencies',
    API_ORDERS : '/api/orders',
    API_ORDERS_ID : '/api/orders/:id',
    API_ORDERS_EDIT : '/api/orders/edit/:code',
    API_ORDERS_SWAPPING : '/api/orders/swapping',
    API_ORDERS_CONFIRMED : '/api/orders/confirmed',
    API_ORDERS_SUBMITTED : '/api/orders/submitted',
    API_ORDERS_SUGGEST : '/api/orders/suggest',
    API_ORDERS_HISTORY : '/api/orders/history',
    API_ORDERS_TOTAL : '/api/orders/total',
    API_ORDERS_LAST_CREATED : '/api/orders/lastcreated',
    API_ORDERS_CONFIRMED_CANCEL : '/api/orders/confirmed/cancel/:id',
    API_ORDERS_CONFIRMED_CLEAR : '/api/orders/confirmed/clear/:id',
    API_ORDERS_SWAPPING_CANCEL : '/api/orders/swapping/cancel/:id',
    API_ORDERS_SWAPPING_CONFIRM : '/api/orders/swapping/confirm/:id',
    API_ORDERS_SUBMITTED_CANCEL : '/api/orders/submitted/cancel/:id',
    API_ORDERS_SUBMITTED_EDIT : '/api/orders/submitted/edit/:id',
    API_ORDERS_SUBMITTED_SWAP : '/api/orders/submitted/swap/:id',
    API_MY_PROFILE: '/api/profile',
    API_PERMISSIONS: '/api/permissions',
    API_SUPPORTS : '/api/supports',
    API_SUPPORTS_CREATOR: '/api/supports/creator',
    API_SUPPORTS_MARKREAD: '/api/supports/markRead',
    API_FORGOT_PASSWORD_VERIFY: '/api/forgotpassword/verify',
    API_FORGOT_PASSWORD_RESET: '/api/forgotpassword/reset',
    API_REGISTER: '/api/register'
};

exports.getRoute = function ( val ) {
    return stringUtil.getValue( val, Routes );
};

exports.routes = Routes;
