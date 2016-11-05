'use strict';

var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.NodeJSApp;

var updatesDb = function () {
    process.exit(0);
};

if(ds.connected) {
    updatesDb();
} else {
    ds.once('connected', function() {
        updatesDb();
    });
}
