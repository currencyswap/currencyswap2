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
var creatorRelation = {
        'relation' : 'creator'
};
var activitiesRelation = {
		'relation' : 'activities',
		'scope' : {
			'include' : [creatorRelation]
		}
};
exports.filterOrders = function (filter) {
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};

exports.getOrderById = function (id) {
    var filter = {
            'where': { 'id': id }
    };
    return dbUtil.executeModelFn(app.models.Order, 'findOne', filter);
};

exports.getOrderByCode = function (orderCode) {
    var filter = {
            'where': { 'code': orderCode },
            'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation, activitiesRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'findOne', filter);
};
exports.updateOrder = function (where, obj) {
    return dbUtil.executeModelFn(app.models.Order, 'updateAll', where, obj);
};

exports.saveOrder = function (newOrder) {
        return dbUtil.executeModelFn(app.models.Order, 'create', newOrder);
};
exports.updateOrderStatus = function (orderId, statusId) {
    var order = { 'statusId': statusId };
    var where = { 'id': orderId };
    return dbUtil.executeModelFn(app.models.Order, 'updateAll', where, order);
};
exports.swapSubmittedOrder = function(orderId, userId, statusId){
	var order = { 'statusId': statusId , 'accepterId' : userId};
    var where = { 'id': orderId };
    return dbUtil.executeModelFn(app.models.Order, 'updateAll', where, order);
}
exports.getUserSwappingOrders = function (userId) {
    var filter = {
            'where': {
            and: [{ or: [{'ownerId': userId}, 
                         {'accepterId': userId}] 
                            },
                  { statusId: constant.STATUS_TYPE.SWAPPING_ID }
            ]
    },
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation, activitiesRelation]
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
    'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation, activitiesRelation]
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
exports.getSuggestOrders = function (userId, value, fixed) {
	var min = value * (1 - constant.SUGGETION_LIST_CONFIG.ROTATE_SUGGETION);
	var max = value * (1 + constant.SUGGETION_LIST_CONFIG.ROTATE_SUGGETION);
	
	var filterFixed = {};
	var order = "";
	
    var filter = {
	    		'limit' : constant.SUGGETION_LIST_CONFIG.LIMIT_NUMBER,
	    		'order' : order,
	            'where': {
	            and: [
	                  //{'ownerId': {'neq': userId}},
	                  //{ 'statusId': constant.STATUS_TYPE.SUBMITTED_ID }
	            ]
            },
            'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation, activitiesRelation]
    };
    
    if(fixed == constant.FIXED_VALUE.GIVE){
    	filter.where.and.push({'give' : { 'lte' : max}});
    	filter.where.and.push({'give' : {'gte' : min}});
    	filter.order = "give DESC";
	}else if(fixed == constant.FIXED_VALUE.GET){
		filter.where.and.push({'get' : { 'lte' : max}});
    	filter.where.and.push({'get' : {'gte' : min}});
    	filter.order = "give DESC";
	}else{
		filter.where.and.push({'rate' : { 'lte' : max}});
    	filter.where.and.push({'rate' : {'gte' : min}});
    	filter.order = "rate DESC";
	}
    
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
    'include' : [ ownerRelation, giveCurrencyRelation, getCurrencyRelation]
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.deleteOrder = function(orderId, userId) {
    var where = {and : [{ 'id': orderId },
                        {'ownerId': userId}]};
    return dbUtil.executeModelFn(app.models.Order, 'destroyAll', where);
};
exports.updateOrderActivity = function (orderId, creatorId, statusId) {
        var where = {and: [{'orderId' : orderId},
                           {'creatorId': creatorId}
                                        ]};
    return dbUtil.executeModelFn(app.models.OrderActivity, 'updateAll', where, {'statusId': statusId});
};
exports.createOrderActivity = function (orderId, creatorId, statusId) {
        var newItem = {'orderId' : orderId,'creatorId': creatorId, 'statusId': statusId};
    return dbUtil.executeModelFn(app.models.OrderActivity, 'create', newItem);
};
exports.getOrderActivity = function (orderId) {
    var filter = {
            'where': {
                'orderId': orderId,
            }
    };
    return dbUtil.executeModelFn(app.models.OrderActivity, 'find', filter);
};
exports.getPartnerOrderOfUser = function(orderId, userId){
    var filter = {
		'where' : {
			and : [ 
			       {'orderId' : orderId}, 
			       {'creatorId' : {'neq' : userId}} 
			   ]
		}
    };
    return dbUtil.executeModelFn(app.models.OrderActivity, 'find', filter);

};
exports.getUserAllOrders = function (userId) {
    var filter = {
    		'where': { or: [{'ownerId': userId}, 
                            {'accepterId': userId}] 
            }
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getPartnerOrderOfUser = function(orderId, userId){
    var filter = {
		'where' : {
			and : [ 
			       {'orderId' : orderId}, 
			       {'creatorId' : {'neq' : userId}} 
			   ]
		}
    };
    return dbUtil.executeModelFn(app.models.OrderActivity, 'find', filter);

};
exports.getUserAllOrders = function (userId) {
    var filter = {
    		'where': { or: [{'ownerId': userId}, 
                            {'accepterId': userId}] 
            }
    };
    return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};