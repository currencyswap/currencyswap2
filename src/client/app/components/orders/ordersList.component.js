'use strict';

angular.module('orders')
    .component('orders', {
        templateUrl: 'app/components/orders/ordersList.template.html',
        controller: ['$scope',
            '$rootScope',
            'CookieService',
            'OrdersService',
            'PermissionService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            '$log',
            function ordersController($scope, $rootScope, CookieService, OrdersService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
        		$scope.swappingOrders = [];
        		$scope.confirmOrders = [];
        		$scope.historyOrders = [];
        		$scope.submittedOrders = [];
        		$scope.currentUser = $rootScope.user;
        		$scope.status = ["Submitted", "Swapping", "Confirmed", "Pending", "Cleared", "Canceled"];
        		$scope.tab = 1;
        		var getSwappingOrders = function () {
	                OrdersService.getSwappingOrders().then(function(resp){
	            		$scope.swappingOrders = resp;
	            		redirectToNewOrder();
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		var getConfirmedOrders = function () {
	                OrdersService.getConfirmedOrders().then(function(resp){
	            		$scope.confirmOrders = resp;
	            		redirectToNewOrder();
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getWorkingOrders = function(){
        			$scope.tab = 1;
        			getSwappingOrders();
        			getConfirmedOrders();
        		};
        		
        		var getSubmittedOrders = function(){
	                OrdersService.getSumittedOrders().then(function(resp){
	            		$scope.submittedOrders = resp;
	            		redirectToNewOrder();
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getSubmittedOrders = function(){
        			$scope.tab = 2;
        			getSubmittedOrders();
        		};
        		var getHistoryOrders = function(){
	                OrdersService.getHistoryOrders().then(function(resp){
	            		$scope.historyOrders = resp;
	            		redirectToNewOrder();
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getHistoryOrders = function(){
        			$scope.tab = 3;
        			getHistoryOrders();
        		}
        		
        		var redirectToNewOrder = function(){
        			if(($scope.swappingOrders && $scope.swappingOrders.length > 0) ||
        					($scope.confirmOrders && $scope.confirmOrders.length > 0) ||
        					($scope.submittedOrders && $scope.submittedOrders.length > 0) ||
        					($scope.historyOrders && $scope.historyOrders.length > 0)){
//        				
        			} else {
//        				$location.path(routes.ORDER_CREATE);
        			}
        		}
        		$scope.test = {
				"code" : "e4dd7619ad",
				"created" : "2016-11-29T09:52:18.000Z",
				"updated" : "2016-11-29T09:52:18.000Z",
				"expired" : "2016-12-02T09:52:15.000Z",
				"rate" : 0.74,
				"give" : 1000,
				"giveCurrencyId" : 9,
				"get" : 900,
				"getCurrencyId" : 2,
				"ownerId" : 2,
				"accepterId" : null,
				"statusId" : 1,
				"id" : 9,
				"owner" : {
					"username" : "demo",
					"email" : "demo@vsii.com",
					"fullName" : "Demo CS",
					"id" : 2
				},
				"giveCurrency" : {
					"code" : "ALL",
					"name" : "Albanian Lek",
					"id" : 9
				},
				"getCurrency" : {
					"code" : "EUR",
					"name" : "Euro",
					"id" : 2
				},
				"status" : {
					"name" : "Submitted",
					"description" : "Order has just been submitted to the market",
					"id" : 1
				},
				"activities" : [ {
					"orderId" : 9,
					"creatorId" : 2,
					"statusId" : 1,
					"created" : "2016-11-29T09:52:18.000Z",
					"description" : "Your order has been publiced to the market",
					"creator" : {
						"username" : "demo",
						"email" : "demo@vsii.com",
						"fullName" : "Demo CS",
						"birthday" : "2016-10-01T00:00:00.000Z",
						"nationalId" : null,
						"cellphone" : null,
						"profession" : null,
						"bankAccountName" : null,
						"bankAccountNumber" : null,
						"bankName" : null,
						"bankCountry" : null,
						"registeredDate" : "2016-11-29T00:00:00.000Z",
						"expiredDate" : "2017-06-30T00:00:00.000Z",
						"status" : "Activated",
						"id" : 2
					}
				} ]
			};   		
        		$scope.isDevice = $.device;
        		$scope.getWorkingOrders();
        		getHistoryOrders();
        		getSubmittedOrders();
        		var getOrderById = function(orderId){
	                OrdersService.getOrderById(orderId).then(function(resp){
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getOrderById = getOrderById;
        		// Cancel swapping order        		
        		var cancelSwappingOrder = function(orderId){
            		var cancelOrder = $window.confirm('Are you sure you want to cancel the Order?');
            	    if(cancelOrder){
		                OrdersService.cancelSwappingOrder(orderId).then(function(resp){
		            		$scope.$evalAsync();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.cancelSwappingOrder = cancelSwappingOrder;
        		// Confirm swapping order
        		var confirmSwappingOrder = function(orderId){
            		var swappingOrder = $window.confirm('Are you sure you want to clear the Order?');
            	    if(swappingOrder){
		                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
		                	getSwappingOrders();
		            		getConfirmedOrders();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.confirmSwappingOrder = confirmSwappingOrder;
        		// Cancel confirmed order        		
        		var cancelConfirmedOrder = function(orderId){
            		var cancelOrder = $window.confirm('Are you sure you want to cancel the Order?');
            	    if(cancelOrder){
		                OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
		                	$scope.getWorkingOrders();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.cancelConfirmedOrder = cancelConfirmedOrder;
        		// Clear confirmed order
        		var clearConfirmedOrder = function(orderId){
            		var clearOrder = $window.confirm('Are you sure you want to clear the Order?');
            	    if(clearOrder){
		                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
		                	$scope.getWorkingOrders();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.clearConfirmedOrder = clearConfirmedOrder;
        		// Cancel submitted order
        		var cancelSubmittedOrder = function(orderId){
            		var cancelOrder = $window.confirm('Are you sure you want to cancel the Order?');
            	    if(cancelOrder){
    	                OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
    	                	getSubmittedOrders();
                        }, function(err){
                            console.log('Failure in saving your message');
                        });
            	    }
        		};
        		$scope.cancelSubmittedOrder = cancelSubmittedOrder;
        		// Edit submitted order
        		var editSubmittedOrder = function(orderCode){
        			var editOrder = $window.confirm('Are you sure you want to edit the Order?');
        			if(editOrder){
        				location.href = "/#!/orders/edit/" + orderCode;
        			}

        		};
        		$scope.editSubmittedOrder = editSubmittedOrder;
        		$scope.checkStatusCurrentUserInActivity = function(activities){
        			var isCleared = false;
        			if(activities){
            			for(var i = 0; i < activities.length; i++){
            				var activity = activities[i];
            				if(activity.creatorId == $scope.currentUser.id && activity.statusId == 5){
            					isCleared = true;
            				}
            			}
        			}
        			return isCleared;
        		}
            }]
    });
