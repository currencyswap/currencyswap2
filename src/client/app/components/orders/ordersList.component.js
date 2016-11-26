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
            function ordersController($scope, $rootScope,CookieService, OrdersService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
        		$scope.swappingOrders = [];
        		$scope.confirmOrders = [];
        		$scope.historyOrders = [];
        		$scope.submittedOrders = [];
        		
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
	                OrdersService.cancelSwappingOrder(orderId).then(function(resp){
	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.cancelSwappingOrder = cancelSwappingOrder;
        		// Confirm swapping order
        		var confirmSwappingOrder = function(orderId){
	                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
//	            		$scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.confirmSwappingOrder = confirmSwappingOrder;
        		// Cancel confirmed order        		
        		var cancelConfirmedOrder = function(orderId){
	                OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
	            		
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.cancelConfirmedOrder = cancelConfirmedOrder;
        		// Clear confirmed order
        		var clearConfirmedOrder = function(orderId){
	                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
	            		
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.clearConfirmedOrder = clearConfirmedOrder;
        		// Cancel submitted order
        		var cancelSubmittedOrder = function(orderId){
	                OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.cancelSubmittedOrder = cancelSubmittedOrder;
        		// Edit submitted order
        		var editSubmittedOrder = function(orderId){
	                OrdersService.editSubmittedOrder(orderId).then(function(resp){
                    }, function(err){
                        console.log('Failure in saving your message');
                    });

        		};
        		$scope.editSubmittedOrder = editSubmittedOrder;

            }]
    });
