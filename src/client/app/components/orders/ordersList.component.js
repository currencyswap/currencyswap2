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
        		window.scrollTo(0, 0);
        		var getSwappingOrders = function () {
	                OrdersService.getSwappingOrders().then(function(resp){
	            		$scope.swappingOrders = resp;
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		var getConfirmedOrders = function () {
        			if($.device){
        				$scope.tab = 4;
        			}
	                OrdersService.getConfirmedOrders().then(function(resp){
	            		$scope.confirmOrders = resp;
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });
        		};
        		$scope.getConfirmedOrders = getConfirmedOrders;
        		$scope.getWorkingOrders = function(){
        			$scope.tab = 1;
        			window.scrollTo(0, 0);
        			getSwappingOrders();
        			if(!$.device)
        				getConfirmedOrders();
        		};
        		
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
        			window.scrollTo(0, 0);
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
        			window.scrollTo(0, 0);
        			getHistoryOrders();
        		}
        		$scope.isDevice = $.device;
        		$scope.getWorkingOrders();
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
		                	if(!$.device){
		                		$scope.getWorkingOrders();
		                	}else{ 
		                		getConfirmedOrders();
		                	}

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
		                	if(!$.device){
		                		$scope.getWorkingOrders();
		                	}else{ 
		                		getConfirmedOrders();
		                	}
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
            				
            				if(activity.creatorId == $scope.currentUser.id && activity.statusId == 4){
            					isCleared = true;
            				}
            			}
        			}
        			return isCleared;
        		}
            }]
    });
