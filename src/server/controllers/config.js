'use strict';

var appConfig = require('../libs/app-config');
var routes = require('../routes').routes;
var util = require('util');
var errors = require('../libs/errors/errors');
var ms = require('ms');
var appRoot = require('app-root-path');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/setting.js', function (req, res) {

        var miliseconds = ms(appConfig.getTokenExpired());

        var config = {
            title: appConfig.getTitle(),
            footer: appConfig.getFooter(),
            dateFormat: appConfig.getDateFormat(),
            cookieExpried: miliseconds
        };

        var jsContent = util.format('window.appConfig = %s;', JSON.stringify(config));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));

    });

    router.get('/api-routes.js', function (req, res) {

        var apiRoutes = {};

        for (var key in routes) {
            if (routes[key] !== routes.API && routes[key].indexOf(routes.API) == 0) {
                apiRoutes[key] = routes[key];
            }
        }

        var jsContent = util.format('window.apiRoutes = %s;', JSON.stringify(apiRoutes));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));
    });

    router.get('/error-codes.js', function (req, res) {
        var errorForClients = {};

        for (var key in errors) {
            errorForClients[key] = errors[key].code;
        }

        var jsContent = util.format('window.serverErrors = %s;', JSON.stringify(errorForClients));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer(jsContent, 'binary'));
    });

    router.get('/media/:filename', function (req, res) {
        var imagePath = appConfig.getMediaFolder() + req.params.filename + '.png';
        res.setHeader('Content-Type', 'image/png');

        console.log("Media Folder : %s", imagePath );
        res.sendFile(imagePath, function (err) {
            if (err) {
                console.log('profile pic was not found');
                res.status(299).send({});
            }
        }) ;
    });

    return router;
};
