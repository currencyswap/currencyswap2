'use strict';

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

var encodeUserNameAndPasswordBase64 = function (username, password) {
    var usernameAndPassword = username + global.DELIMITER + password;
    return b64EncodeUnicode(usernameAndPassword);
};