'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var util = require('util');
var constants = require('../libs/constants/constants');
module.exports = function(Address) {
    Address.updateAddress = function (userid,address, callback) {
        console.log("updateAddress",address);
        console.log("address[0].country",address[0].address);
        var where = {
            memberId: userid
        };

        var value = {
            address : address[0].address,
            city: address[0].city,
            country: address[0].country,
            state: address[0].state,
            postcode: address[0].postcode
        };
        Address.findOrCreate(where,value,function (err, info) {
            callback(err,info);
        });
    };
};
