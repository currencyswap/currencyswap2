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
    	var orders = [{
    		"code": "W321R3",
    		"ownerId": "2",
    		"accepterId": "",
    		"giveCurrencyId":"1",
    		"getCurrencyId" :"2",
    		"statusId":"2",
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1100,
    		"get": 700,
    		"rate": 0.72

    	},{
    		"code": "W321R2",
    		"ownerId": "3",
    		"accepterId": "",
    		"giveCurrencyId":"2",
    		"getCurrencyId":"1",
    		"statusId":"2",
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1200,
    		"get": 700,
    		"rate": 0.73

    	}
    	];
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
//        	return res.send(orders);
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });

    router.get('/confirmed', function (req, res) {
    	var orders = [{
    		"code": "W321R4",
    		"ownerId": "4",
    		"accepterId": "",
    		"giveCurrencyId":"7",
    		"getCurrencyId":"1",
    		"statusId":4,
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1000,
    		"get": 700,
    		"rate": 0.71

    	},{
    		"code": "W321R1",
    		"ownerId": "5",
    		"accepterId": "",
    		"giveCurrencyId":"1",
    		"getCurrencyId":"3",
    		"statusId":3,
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1210,
    		"get": 700,
    		"rate": 0.711

    	}
    	];
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
//        	return res.send(orders);
          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });        
    });
    router.get('/submitted', function (req, res) {
    	var orders = [{
    		"code": "W321R6",
    		"ownerId": "3",
    		"accepterId": "",
    		"giveCurrencyId":"2",
    		"getCurrencyId":"3",
    		"statusId":1,
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1000,
    		"get": 750,
    		"rate": 0.71
    	}
    	];
    	var user = req.currentUser;
    	console.log('submitted', JSON.stringify(user.id));
		var filter = {
			where: {
    			and: [{'ownerId': user.id}, 
    			      { statusId: 1 }
    			]
    		},
    		'include' : [ ownerRelation, accepterRelation, giveCurrencyRelation, getCurrencyRelation, statusRelation]
		
		}
        service.filterOrders(filter).then(function(resp){
//        	console.log(orders);
//        	return res.send(orders);
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
    	var orders = [{
    		"code": "W321R4",
    		"ownerId": "4",
    		"accepterId": "",
    		"giveCurrencyId":"7",
    		"getCurrencyId":"1",
    		"statusId":5,
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1070,
    		"get": 700,
    		"rate": 0.71

    	},{
    		"code": "W321R5",
    		"ownerId": "6",
    		"accepterId": "",
    		"giveCurrencyId":"7",
    		"getCurrencyId":"2",
    		"statusId":6,
    		"created": new Date(),
    		"updated": new Date(),
    		"expired": new Date(),
    		"give": 1500,
    		"get": 1200,
    		"rate": 0.76

    	}
    	];
    	var user = req.currentUser;
    	console.log('history', JSON.stringify(user.id));
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
//        	return res.send(orders);
          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/:id', function (req, res) {
    	var orderId = req.params.id;
    	var order = {
        		"code": "W321R5",
        		"ownerId": "6",
        		"accepterId": "",
        		"giveCurrencyId":"7",
        		"getCurrencyId":"2",
        		"statusId":6,
        		"created": new Date(),
        		"updated": new Date(),
        		"expired": new Date(),
        		"give": 1500,
        		"get": 1200,
        		"rate": 0.76

        	};
		var filter = {
				where: {
	    			"id": orderId
	    		}
			}

        service.getOrderById(filter).then(function(resp){
        	return res.send(order);
//          return res.send(resp);

        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        	
        });
    });
    
    return router;
};

