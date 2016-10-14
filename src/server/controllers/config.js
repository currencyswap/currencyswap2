'use strict';

var appConfig = require('../libs/app-config');
var util = require('util');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/setting.js', function (req, res) {

        let config = {
            title: appConfig.getTitle(),
            dateFormat: appConfig.getDateFormat(),
            cookieExpried: appConfig.getTokenExpired()
        };

        var jsContent = util.format('window.appConfig = %s;', JSON.stringify(config));

        res.setHeader('Content-Type', 'application/javascript');
        res.end(new Buffer( jsContent, 'binary'));

    });

    return router;
};
