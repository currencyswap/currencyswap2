/* ***************************************************************** */
/*                                                                   */
/* VSI-International Confidential                                    */
/*                                                                   */
/* OCO Source Materials                                              */
/*                                                                   */
/* Copyright VSI-International Corp. 2016                            */
/*                                                                   */
/* The source code for this program is not published or otherwise    */
/* divested of its trade secrets, irrespective of what has been      */
/* deposited with the VN. Copyright Office.                         */
/*                                                                   */
/* ***************************************************************** */
'use strict';
var log4js = require('log4js');
var appConfig = require('./app-config');
const errors = require('./errors/errors');
var errorUtil = require('./errors/error-util');

var exports = module.exports;

exports.initLogs = function () {

    let logFolder = appConfig.getLogsFolder();

    if (logFolder === undefined || logFolder === null || logFolder.length == 0) {
        let error = errorUtil.createAppError(errors.INVALID_LOGS_PARAMS)
        throw error;
    }

    log4js.configure({
        appenders: [
            {
                type: 'console'
            }, {
                type: 'dateFile',
                filename: logFolder + '/access.log',
                pattern: '_yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLogSize: 1024 * 1024,
                backups: 20,
                category: 'access'
            }, {
                type: 'dateFile',
                filename: logFolder + '/console.log',
                pattern: '_yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                maxLogSize: 1024 * 1024,
                backups: 20,
                category: 'console'
            }
        ],
        replaceConsole: true
    });

    return log4js;
};

exports.setupLogs = function () {

    var logLevel = (process.env.LOG_LEVEL || 'INFO')
    // FATAL, ERROR, WARN, INFO, DEBUG, TRACE
    
    var logjs = exports.initLogs();
    // write access logs into access.log
    // var logAccess = logjs.getLogger('access')
    // app.use(logjs.connectLogger(logAccess, {level: 'auto'}))
    // write console logs into log

    var logConsole = logjs.getLogger('console');

    logConsole.setLevel(logLevel)
} 
