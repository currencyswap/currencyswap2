'use strict';

var appConfig = require('../libs/app-config');
var routes = require('../routes').routes;
var util = require('util');
var errors = require('../libs/errors/errors');
var ms = require('ms');
module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/setting.js', function (req, res) {

        let miliseconds = ms( appConfig.getTokenExpired() );

        let config = {
            title: appConfig.getTitle(),
            dateFormat: appConfig.getDateFormat(),
            cookieExpried: miliseconds
        };

        var jsContent = util.format('window.appConfig = %s;', JSON.stringify(config));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));

    });

    router.get('/api-routes.js', function (req, res) {

        let apiRoutes = {};

        for (let key in routes) {
            if (routes[key] !== routes.API && routes[key].indexOf(routes.API) == 0) {
                apiRoutes[key] = routes[key];
            }
        }

        var jsContent = util.format('window.apiRoutes = %s;', JSON.stringify(apiRoutes));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));
    });

    router.get('/error-codes.js', function (req, res) {

        let errorForClients = {};

        for (let key in errors) {
            errorForClients[key] = errors[key].code;
        }

        var jsContent = util.format('window.serverErrors = %s;', JSON.stringify(errorForClients));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));
    });

    return router;
};
