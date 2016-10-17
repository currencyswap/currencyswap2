'use strict';

const messages = require('../../messages/messages');
const BASE64 = 'base64';
var exports = module.exports;

exports.getValue = function ( key, keyMap ) {
    var regex = /\{[_a-zA-Z][_0-9a-zA-Z]*\}/;

    if (regex.test(key)) {
        key = key.replace(/[\{\}]/g, '');
        return keyMap[key];
    }

    return key;
};

exports.getMessage = function (val) {
    return exports.getValue( val, messages );
};

exports.decodeBase64 = function (base64Str) {

    let buff = new Buffer( base64Str, BASE64 );

    return buff.toString();
};
