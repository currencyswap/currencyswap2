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
        		$scope.currentUser = CookieService.getCurrentUser();
        		$scope.status = ["Submitted", "Swapping", "Confirmed", "Pending", "Cleared", "Cancelled"];
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
        		$scope.reverse = {'working': false, 'confirmed': false, 'submitted': false, 'history': false};
        		$scope.propertyName = {'working': 'updated', 'confirmed': 'updated', 'submitted': 'updated', 'history': 'updated'};
        		$scope.sortBy = function(propertyName, listName) {
        		    $scope.reverse[listName] = ($scope.propertyName[listName] === propertyName) ? !$scope.reverse[listName] : false;
        		    $scope.propertyName[listName] = propertyName;
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
        		var cancelSwappingOrder = function(orderId, ownerUsername){
        			var msg = 'If you cancel, this order will be removed from your list. Do you want continue?';
        			if($scope.currentUser.username==ownerUsername)
        				msg = 'State of this order will be changed to Submitted. Do you want continue?';
            		var cancelOrder = $window.confirm(msg);
            	    if(cancelOrder){
		                OrdersService.cancelSwappingOrder(orderId).then(function(resp){
		                	if(resp.isError){
		                		alert(resp.message);
		                	}
		                	getSwappingOrders();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.cancelSwappingOrder = cancelSwappingOrder;
        		// Confirm swapping order
        		var confirmSwappingOrder = function(orderId){
            		var swappingOrder = $window.confirm('State of this order will be changed to Confirmed. Do you want continue?');
            	    if(swappingOrder){
		                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
		                	if(resp.isError){
		                		alert(resp.message);
		                	}
		                	getSwappingOrders();
		            		getConfirmedOrders();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		$scope.confirmSwappingOrder = confirmSwappingOrder;
        		// Cancel confirmed order        		
        		var cancelConfirmedOrder = function(orderId, statusId){
        			var msg = 'State of this order will be changed to Cancelled. Do you want continue?';
            		var cancelOrder = $window.confirm(msg);
            	    if(cancelOrder){
		                OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
		                	if(resp.isError){
		                		alert(resp.message);
		                	}
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
        		var clearConfirmedOrder = function(orderId, statusId){
        			var msg = 'State of this order will be changed to Pending. Do you want continue?';
        			if(statusId == 4){
        				msg= 'State of this order will be changed to Cleared. Do you want continue?';
        			}

            		var clearOrder = $window.confirm(msg);
            	    if(clearOrder){
		                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
		                	if(resp.isError){
		                		alert(resp.message);
		                	}
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
            		var cancelOrder = $window.confirm('If you cancel, this order will be deleted. Do you want continue?');
            	    if(cancelOrder){
    	                OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
		                	if(resp.isError){
		                		alert(resp.message);
		                	}
    	                	getSubmittedOrders();
                        }, function(err){
                            console.log('Failure in saving your message');
                        });
            	    }
        		};
        		$scope.cancelSubmittedOrder = cancelSubmittedOrder;
        		// Edit submitted order
        		var editSubmittedOrder = function(orderCode){
        			//var editOrder = $window.confirm('Are you sure you want to edit the Order?');
        			//if(editOrder){
        				location.href = "/#!/orders/edit/" + orderCode;
        			//}

        		};
        		$scope.editSubmittedOrder = editSubmittedOrder;
        		$scope.checkStatusCurrentUserInActivity = function(activities){
        			var isCleared = false;
        			if(activities && activities.length > 0){
        				var activity = activities[0];
        				if(activity.creator.username == $scope.currentUser.username && activity.statusId == 4){
        					isCleared = true;
        				}
        			}
        			return isCleared;
        		}
            }]
    });
