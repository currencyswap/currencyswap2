'use strict';

var AppError = require('../libs/errors/app-error');
var errors = require('../libs/errors/errors');
var stringUtil = require('../libs/utilities/string-util');
var messages = require('../messages/messages');
var constant = require('../libs/constants/constants');
var service = require('../services/order-service');
var statusTypeService = require('../services/status-type-service');
var orderConverter = require('../converters/order-converter');
var appConfig = require('../libs/app-config');
var util = require('util');
var cryptoUtil = require('../libs/utilities/crypto_util'); 
var supportService = require('../services/support-service');
var CODE_LENGTH = 10;
module.exports = function (app) {
    var router = app.loopback.Router();

    var generateCode = function(id){
        var key = id + (new Date()) + Math.random();
        return cryptoUtil.createHash(key).substring(0, CODE_LENGTH);
    }



    
    var saveMessage = function(title, content, adminId, userId, orderCode){
//      Send 1 message to 1 user
    	var message = {'title': title, 
            'message': content, 
            'creatorId': adminId, 'receiverId': userId, 'orderCode': orderCode}
    	console.log(message);
        supportService.saveMessage(message);   	
    }
    var updateOrderStatus = function (req, res, statusId, title, message){
        var orderId = req.params.id;
        var creatorId = req.currentUser.id
        service.updateOrderStatus(orderId, statusId).then(function(resp){
        	updateOrderActivity(req, res, orderId, creatorId, statusId);
        	service.getOrderById(orderId).then(function(data){
        		var ownerId = data.ownerId;
        	    var accepterId = data.accepterId;
        	    var userId= ownerId;
        	    if(creatorId == userId){
        	    	userId = accepterId
        	    }
        	    saveMessage(title, message, creatorId, userId, data.code);
        	},function(err){
        		
        	});
            return res.send(resp);
          }, function(err){
              return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
          });
    };
    var updateOrderActivity = function (req, res, orderId, creatorId, statusId){
    	console.log('updateOrderActivity');
        service.updateOrderActivity(orderId, creatorId, statusId).then(function(resp){
        }, function(err){
        });
    };    
    var cancelSubmittedOrder = function(req, res){
    	var orderId = req.params.id;
    	var userId = 	req.currentUser.id
        service.deleteOrder(orderId, userId).then(function(resp){
            return res.send(resp);
          }, function(err){
              return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
          });
    	
    };
    router.get('/genOrderCode', function (req, res) {
        res.send(generateCode(req.currentUser.id + req.currentUser.username));
    });
    router.post('/', function (req, res) {
        // handle register request
        var clientOrderData = req.body;
        var newOrder = orderConverter.convertOrderData(clientOrderData);
        newOrder.ownerId = req.currentUser.id;
        newOrder.code = clientOrderData.code||generateCode(req.currentUser.id + req.currentUser.username);
        newOrder.statusId = constant.STATUS_TYPE.SUBMITTED_ID;
        console.log("saving new order : " + JSON.stringify(clientOrderData));
        service.saveOrder(newOrder).then(function (dataSave) {
            return res.status(200).send({dataSave : dataSave, newOrder : newOrder});
            },function (err) {
                    return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            });
    });
    router.get('/', function (req, res) {
        service.getUserAllOrders(req.currentUser.id).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/swapping', function (req, res) {
        service.getUserSwappingOrders(req.currentUser.id).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/confirmed', function (req, res) {
        service.getUserConfirmedOrders(req.currentUser.id).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/submitted', function (req, res) {
        service.getUserSubmittedOrders(req.currentUser.id).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    
    router.get('/swapping/cancel/:id', function (req, res) {
        return updateOrderStatus(req, res, constant.STATUS_TYPE.SUBMITTED_ID, constant.MSG.CANCEL_ORDER_TITLE, constant.MSG.CANCEL_ORDER_CONTENT);
    });
    router.get('/swapping/confirm/:id', function (req, res) {
        return updateOrderStatus(req, res, constant.STATUS_TYPE.CONFIRMED_ID, constant.MSG.CONFIRM_ORDER_TITLE, constant.MSG.CONFIRM_ORDER_CONTENT);
    });

    router.get('/confirmed/cancel/:id', function (req, res) {
        return updateOrderStatus(req, res, constant.STATUS_TYPE.SUBMITTED_ID, constant.MSG.CANCEL_ORDER_TITLE, constant.MSG.CANCEL_ORDER_CONTENT);
    });
    var countUserCleared = function(userId, orderId, statusId){
    	var count = -1;
    	service.getOrderActivity(orderId).then(function(activities){
			if(activities){
				for(var i = 0; i < activities.length; i++){
    				var activity = activities[i];
    				if(activity.statusId == statusId){
    					count +=1;
    				}
    			}
			}
    	}, function(err){
    		return count;
    	});
    	return count; 
    }
    router.get('/confirmed/clear/:id', function (req, res) {
    	return updateOrderStatus(req, res, constant.STATUS_TYPE.CLEARED_ID, constant.MSG.CLEAR_ORDER_TITLE, constant.MSG.CLEAR_ORDER_CONTENT);
    });
    router.get('/submitted/cancel/:id', function (req, res) {
        return cancelSubmittedOrder(req, res);
    });
    router.get('/submitted/edit/:id', function (req, res) {
//        return updateOrderStatus(req, res, constant.STATUS_TYPE.CLEARED_ID, constant.MSG.CANCEL_ORDER_TITLE, constant.MSG.CANCEL_ORDER_MESSAGE);
    });
    router.get('/suggest', function (req, res) {
        var give = req.query.give;
        var get = req.query.get;
        var rate = req.query.rate;
        var fixed = req.query.fixed;// fixed = 1 (give) , 2 (get), 3 (rate)
        service.getSuggestOrders(req.currentUser.id, give, get, rate, fixed).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/history', function (req, res) {
        service.getUserHistoryOrders(req.currentUser.id).then(function(resp){
          return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/:code', function (req, res) {
        var orderCode = req.params.code;
        service.getOrderByCode(orderCode).then(function(resp){
          return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
                
        });
    });
    return router;
};

