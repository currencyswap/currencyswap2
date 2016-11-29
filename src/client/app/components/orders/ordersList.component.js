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
        		
//        		alert(JSON.stringify($rootScope.user ));
        		$scope.status = ["Submitted", "Swapping", "Confirmed", "Pending", "Cleared", "Canceled"];
        		$scope.tab = 1;
        		var getSwappingOrders = function () {
	                OrdersService.getSwappingOrders().then(function(resp){
	            		$scope.swappingOrders = resp;
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		var getConfirmedOrders = function () {
	                OrdersService.getConfirmedOrders().then(function(resp){
	            		$scope.confirmOrders = resp;
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
        		$scope.getWorkingOrders();
        		var getSubmittedOrders = function(){
        			
	                OrdersService.getSumittedOrders().then(function(resp){
	            		$scope.submittedOrders = resp;
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
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getHistoryOrders = function(){
        			$scope.tab = 3;
        			getHistoryOrders();
        		}
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
                        }, function(err){
                            console.log('Failure in saving your message');
                        });
            	    }
        		};
        		$scope.cancelSubmittedOrder = cancelSubmittedOrder;
        		// Edit submitted order
        		var editSubmittedOrder = function(orderId){
//	                OrdersService.editSubmittedOrder(orderId).then(function(resp){
//                    }, function(err){
//                        console.log('Failure in saving your message');
//                    });

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
        			/*
        			if(owner)
        			else 
        			*/
//        			[{"orderId":3,"creatorId":2,"statusId":1,"created":"2016-11-28T07:22:29.000Z","description":"Your order has been publiced to the market"},{"orderId":3,"creatorId":3,"statusId":2,"created":"2016-11-28T07:22:29.000Z","description":"Request to swap money"}]}
        			return isCleared;
        		}
            }]
    });
