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
        supportService.saveMessage(message);   	
    }

    var updateOrderStatus = function (req, res, statusId, message){
    	var status = ["Submitted", "Swapping", "Confirmed", "Pending", "Cleared", "Canceled"];
        var orderId = req.params.id;
        var creatorId = req.currentUser.id
        service.updateOrderStatus(orderId, statusId).then(function(resp){
        	if(statusId == 1){
                service.removeOrderActivity(orderId).then(function(resp){
                }, function(err){
                	console.log('removeOrderActivity error : ' + JSON.stringify(err));
                });
        	} else {
        		createOrderActivity(orderId, creatorId, statusId, message);	
        	}
        	
        	service.getOrderById(orderId).then(function(order){
        		var ownerId = order.ownerId;
        	    var accepterId = order.accepterId;
        	    var userId= ownerId;
        	    if(creatorId == userId){
        	    	userId = accepterId
        	    }
        	    var title ="";
        	    var msg ="";
        	    if(statusId == 1){
            	    title = "Order " + order.code + "has been cancelled";
            	    msg = title;
        	    	
        	    } else {
            	    var title = "Order " + order.code + "has updated";
            	    var msg = "Order " + order.code + " has been changed from" + status[statusId - 2] + " to " +status[statusId - 1];
        	    	
        	    }
        	    saveMessage(title, msg, creatorId, userId, order.code);
        	},function(err){
        		
        	});
            return res.send(resp);
          }, function(err){
              return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
          });
    };
    var createOrderActivity = function (orderId, creatorId, statusId, description){
        service.createOrderActivity(orderId, creatorId, statusId, description).then(function(resp){
        	console.log('createOrderActivity success');
        }, function(err){
        	console.log('createOrderActivity error : ' + JSON.stringify(err));
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
    var swapSubmittedOrder = function(req, res){
    	var orderId = req.params.id;
    	var userId = 	req.currentUser.id
        service.swapSubmittedOrder(orderId, userId, constant.STATUS_TYPE.SWAPPING_ID).then(function(resp){
        	createOrderActivity(orderId, userId, constant.STATUS_TYPE.SWAPPING_ID)
            return res.send(resp);
          }, function(err){
              return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
          });
    	
    };
    router.get('/genOrderCode', function (req, res) {
        res.send(generateCode(req.currentUser.id + req.currentUser.username));
    });
    router.post('/', function (req, res) {
        var clientOrderData = req.body;
        var newOrder = orderConverter.convertOrderData(clientOrderData);
        newOrder.ownerId = req.currentUser.id;
        newOrder.code = clientOrderData.code||generateCode(req.currentUser.id + req.currentUser.username);
        newOrder.statusId = constant.STATUS_TYPE.SUBMITTED_ID;
        service.saveOrder(newOrder).then(function (dataSave) {
            return res.status(200).send(dataSave);
        },function (err) {
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.put('/:code', function (req, res) {
    	
    	var code = req.params.code;
    	var userId = req.currentUser.id;
        var clientOrderData = req.body;
        var newOrder = orderConverter.convertOrderData(clientOrderData);
        
        var orderUpdate = {};
        orderUpdate.rate = newOrder.rate;
        orderUpdate.give = newOrder.give;
        orderUpdate.get = newOrder.get;
        orderUpdate.giveCurrencyId = newOrder.giveCurrencyId;
        orderUpdate.getCurrencyId = newOrder.getCurrencyId;
        orderUpdate.updated = newOrder.updated;
        
        service.getOrderForEdit(code, userId, constant.STATUS_TYPE.SUBMITTED_ID).then(function(resp){
        	if(!resp){
        		return res.send(resp);
        	}
        	
        	//update expired
        	var dayLive = clientOrderData.dayLive ? parseInt(clientOrderData.dayLive) : 3;
            var expired = new Date(resp.created);
            expired.setDate(expired.getDate() + dayLive);
            orderUpdate.expired = expired;
            
        	service.updateOrderByCode(code, orderUpdate).then(function (dataSave) {
                return res.status(200).send({dataSave : dataSave});
            },function (err) {
                return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            });
        }, function(err){
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
        	console.log("++++++++++");
        	console.log(JSON.stringify(resp));
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
        return updateOrderStatus(req, res, constant.STATUS_TYPE.SUBMITTED_ID, constant.MSG.CANCEL_ORDER_CONTENT);
    });
    router.get('/swapping/confirm/:id', function (req, res) {
        return updateOrderStatus(req, res, constant.STATUS_TYPE.CONFIRMED_ID, constant.MSG.CONFIRM_ORDER_CONTENT);
    });

    router.get('/confirmed/cancel/:id', function (req, res) {
        return updateOrderStatus(req, res, constant.STATUS_TYPE.SUBMITTED_ID, constant.MSG.CANCEL_ORDER_CONTENT);
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
    	var orderId = req.params.id;
    	service.getOrderById(orderId).then(function(order){
    		if(order.statusId == 3 ){
    			return updateOrderStatus(req, res, constant.STATUS_TYPE.PENDING_ID, constant.MSG.PENDING_ORDER_CONTENT);
    		} else {
    			return updateOrderStatus(req, res, constant.STATUS_TYPE.CLEARED_ID, constant.MSG.CLEAR_ORDER_CONTENT);
    		}
    	},function(err){
    		return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
    	});

    	
    });
    router.get('/submitted/cancel/:id', function (req, res) {
        return cancelSubmittedOrder(req, res);
    });
    router.get('/submitted/edit/:id', function (req, res) {
//        return updateOrderStatus(req, res, constant.STATUS_TYPE.CLEARED_ID, constant.MSG.CANCEL_ORDER_TITLE, constant.MSG.CANCEL_ORDER_MESSAGE);
    });
    router.get('/submitted/swap/:id', function (req, res) {
        return swapSubmittedOrder(req, res);
    });
    router.get('/suggest', function (req, res) {
        var value = req.query.value;
        var fixed = req.query.fixed;// fixed = 1 (give) , 2 (get), 3 (rate)
        
        service.getSuggestOrders(req.currentUser.id, value, fixed).then(function(resp){
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
    router.get('/total', function (req, res) {
        service.getTotalOrderOfUser(req.currentUser.id).then(function(count){
          return res.send({count: count});
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
                
        });
    });
    
    router.get('/:code', function (req, res) {
    	var userId = req.currentUser.id;
        var orderCode = req.params.code;
        service.getOrderByCode(orderCode, userId).then(function(resp){
        	return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/edit/:code', function (req, res) {
    	var userId = req.currentUser.id;
        var code = req.params.code;
        service.getOrderForEdit(code, userId, constant.STATUS_TYPE.SUBMITTED_ID).then(function(resp){
        	return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    return router;
};

