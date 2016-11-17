'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var util = require('util');
var constants = require('../libs/constants/constants');
module.exports = function(Address) {
    Address.updateAddress = function (userid,address, callback) {
        var where = {
            memberId: userid
        };
        var filter = {
            where: where
        };

        var value = {
            address : address[0].address,
            city: address[0].city,
            country: address[0].country,
            state: address[0].state,
            postcode: address[0].postcode,
            memberId: userid
        };
        Address.updateAll(filter,value,function (err, info) {
            callback(err,info);
        });
    };
};
