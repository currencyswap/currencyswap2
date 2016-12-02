'use strict';
var express = require('express');
var path = require('path');

var auth = require('./libs/authentication');
var routes = require('./routes').routes;
var checker = require('./security/permission-checker');
var ExpError = require('./libs/errors/error-common');

module.exports = function (app) {
    app.use( routes.HOME, express.static(path.join(__dirname , '../client')));
    // app.use( routes.CLIENT, express.static(path.join(__dirname , '../client/app')));
    app.use(routes.CONFIG, require('./controllers/config')(app));
    app.use(routes.API_AUTHENTICATE, require('./controllers/authenticate')(app));
    app.use(routes.API_FORGOT_PASSWORD_VERIFY, require('./controllers/forgotpassword-verifyInfo')(app));
    app.use(routes.API_FORGOT_PASSWORD_RESET, require('./controllers/forgotpassword-reset')(app));
    app.use(routes.API_REGISTER, require('./controllers/register')(app));

    // LOGIN REQUIRED
    app.use(auth.authenticateByToken);
    app.use(checker.checkPermission);
    //
    app.use(routes.API_USERS, require('./controllers/users')(app));
    app.use(routes.API_ORDERS, require('./controllers/orders')(app));
    app.use(routes.API_CURRENCIES, require('./controllers/currencies')(app));
    app.use(routes.API_MY_PROFILE, require('./controllers/profile')(app));
    app.use(routes.API_PERMISSIONS, require('./controllers/permissions')(app));
    app.use(routes.API_SUPPORTS, require('./controllers/supports')(app));

//  catching for any unknown error
//    process.on('uncaughtException', function(err) {
//      console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
//      console.error(err.stack);
//      if (process.env.NODE_ENV == 'development') {
//          process.exit(1);
//      }
//    });
    app.use(ExpError.errorHandler404);
    app.use(ExpError.errorHandler500);
};
