'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var dbUtil = require('../libs/utilities/db-util');
var constant = require('../libs/constants/constants');

var ownerRelation = {
        'relation' : 'owner',
        'scope' : {
            'fields' : [ 'id', 'username', 'email', 'fullName' ],
        }
};
var accepterRelation = {
        'relation' : 'accepter',
        'scope' : {
            'fields' : [ 'id', 'username', 'email', 'fullName' ],
        }
};

var giveCurrencyRelation = {
        'relation' : 'giveCurrency'
};
var getCurrencyRelation = {
        'relation' :'getCurrency'
}

var statusRelation = {
        'relation' : 'status'
};

exports.filterOrders = function (filter) {
        return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getOrderById = function (orderId) {
    var filter = {
            'where': { 'id': orderId },
            'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
        return dbUtil.executeModelFn(app.models.Order, 'findOne', filter);
};
exports.updateOrder = function (where, obj) {
        return dbUtil.executeModelFn(app.models.Order, 'updateAll', where, obj);
};
exports.removeOrder = function(orderId) {
        return execModelFn(Order, 'destroyById', orderId);
};
exports.saveOrder = function (newOrder) {
        return dbUtil.executeModelFn(app.models.Order, 'create', newOrder);
};
exports.updateOrderStatus = function (orderId, statusId) {
    var order = { 'statusId': statusId };
    var where = { 'id': orderId };
    return dbUtil.executeModelFn(app.models.Order, 'updateAll', where, order);
};
exports.getUserSwappingOrders = function (userId) {
    var filter = {
            'where': {
            and: [{ or: [{'ownerId': userId}, 
                         {'accepterId': userId}] 
                            },
                  { statusId: constant.STATUS_TYPE.SWAPPING_ID }
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getUserConfirmedOrders = function (userId) {
    var filter = {
            'where': {
            and: [{ or: [{'ownerId': userId}, 
                         {'accepterId': userId}] 
                            },
                  {or : [ {'statusId': constant.STATUS_TYPE.CONFIRMED_ID}, { 'statusId': constant.STATUS_TYPE.PENDING_ID} ]}
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};

exports.getUserSubmittedOrders = function (userId) {
    var filter = {
            'where': {
            and: [{'ownerId': userId}, 
                  { statusId: constant.STATUS_TYPE.SUBMITTED_ID }
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getUserHistoryOrders = function (userId) {
    var filter = {
            'where': {
            and: [{ or: [{'ownerId': userId}, 
                         {'accepterId': userId}] 
                            },
                  {or : [ {'statusId': constant.STATUS_TYPE.CLEARED_ID}, { 'statusId': constant.STATUS_TYPE.CANCELED_ID} ]}
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getSuggestOrders = function (userId, give, get, rate, fixed) {
    var filter = {
            'where': {
            and: [
                  {'ownerId': {'neq': userId}},
                  { 'statusId': constant.STATUS_TYPE.SUBMITTED_ID }
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getExpiredOrders = function (time) {
    var filter = {
            'where': {
            and: [
                  {'expired': {'lt': time}},
                  { 'statusId': constant.STATUS_TYPE.SUBMITTED_ID }
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};