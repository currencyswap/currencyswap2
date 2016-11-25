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
var gen = require('../libs/utilities/crypto_util'); 

module.exports = function (app) {
    var router = app.loopback.Router();
    var ownerRelation = {
		'relation' : 'owner'
	};
    var accepterRelation = {
    		'relation' : 'accepter'
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
	
    router.post('/', function (req, res) {
    	
        // handle register request
        var clientOrderData = req.body;
        var newOrder = orderConverter.convertOrderData(clientOrderData);
        newOrder.ownerId = req.currentUser.id;
        newOrder.code = gen.createHash('order'+new Date()).substring(0, 10);
        
        console.log("save new order : " + JSON.stringify(clientOrderData));
        
        statusTypeService.filterStatusType({}).then(function(resp){
        	for(var i in resp){
        		if(constant.STATUS_TYPE.SUBMITTED == resp[i].name){
        			newOrder.statusId = resp[i].id;
        			break;
        		}
        	}
        	
        	//return res.status(constant.HTTP_SUCCESS_CODE).send(newOrder);
        	
        	service.saveOrder(newOrder).then(function (dataSave) {
        		return res.status(200).send({dataSave : dataSave, newOrder : newOrder});
        	},function (err) {
        		return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        	});
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
        
    });
    
    router.get('/swapping', function (req, res) {
    	var user = req.currentUser;
    	console.log(JSON.stringify(user.id));
		var filter = {
			'where': {
    			and: [{ or: [{'ownerId': user.id}, 
    			             {'accepterId': user.id}] 
    					},
    			      { statusId: 2 }
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		}
        service.filterOrders(filter).then(function(resp){
        	console.log(resp);
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    function updateOrder(orderId, statusId){
    	console.log(orderId, statusId);
		var order = {
			statusId: statusId
		}
		var where = {
			and : [{'id': orderId}]
		}
        service.updateOrder(where, order).then(function(resp){
        	console.log(resp);
            return res.send(resp);
          }, function(err){
        	  console.log(err);
              return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
          });	
    }
    router.get('/swapping/cancel/:id', function (req, res) {
    	var orderId = req.params.id;
    	return updateOrder(orderId, 1);
    });
    router.get('/swapping/confirm/:id', function (req, res) {
    	var orderId = req.params.id;
    	console.log('swapping to confirm');
    	return updateOrder(orderId, 3);
    });

    router.get('/confirmed', function (req, res) {
    	var user = req.currentUser;
    	console.log(JSON.stringify(user.id));
		var filter = {
			where: {
    			and: [{ or: [{'ownerId': user.id}, 
    			             {'accepterId': user.id}] 
    					},
    			      {or : [ {statusId: 3}, { statusId: 4} ]}
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		}
        service.filterOrders(filter).then(function(resp){
          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });        
    });
    router.get('/confirmed/cancel/:id', function (req, res) {
    	var orderId = req.params.id;
    	return updateOrder(orderId, 1);
    });
    router.get('/confirmed/clear/:id', function (req, res) {
    	var orderId = req.params.id;
    	return updateOrder(orderId, 5); 	
    });
    router.get('/submitted', function (req, res) {
    	var user = req.currentUser;
		var filter = {
			where: {
    			and: [{'ownerId': user.id}, 
    			      { statusId: 1 }
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		}
        service.filterOrders(filter).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/suggest', function (req, res) {
    	var user = req.currentUser;
    	console.log('submitted', JSON.stringify(user.id));
		var filter = {
			where: {
    			and: [
    			      //{'ownerId': {'neq' : user.id} }, 
    			      { statusId: 1 }
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		
		}
        service.filterOrders(filter).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
        
    });
    router.get('/history', function (req, res) {
    	var user = req.currentUser;
		var filter = {
			where: {
    			and: [{ or: [{'ownerId': user.id}, 
    			             {'accepterId': user.id}] 
    					},
    			      {or : [ {statusId: 5}, { statusId: 6} ]}
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		}
        service.filterOrders(filter).then(function(resp){
          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/:id', function (req, res) {
    	var orderId = req.params.id;
		var filter = {
			where: {
    			"id": orderId
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		}
        service.getOrderById(filter).then(function(resp){
          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        	
        });
    });
    return router;
};

