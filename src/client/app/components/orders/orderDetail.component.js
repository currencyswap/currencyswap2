'use strict';

angular.module('orders')
    .component('orderDetail', {
        templateUrl: 'app/components/orders/orderDetail.template.html',
        controller: ['$scope',
            '$rootScope',
            '$route',
            '$routeParams',
            'OrdersService',
            'CookieService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function orderDetailController($scope, $rootScope, $route,$routeParams, OrdersService, CookieService, $location, $http, $window, GLOBAL_CONSTANT) {
        		console.log("orderDetailController ....");
        		var orderCode = $routeParams.orderCode;
        		//orderCode = $route.current.params.orderCode;
        		var currentUser = CookieService.getCurrentUser();
        		
        		$scope.statusType = GLOBAL_CONSTANT.STATUS_TYPE;
        		$scope.orderStatus = "";
        		$scope.isOwnerOrder = false;
        		
        		var getOrderDetail = function(orderCode){
        			OrdersService.getOrderByCode(orderCode).then(function(data){
        				console.log("getOrderDetail success: " + JSON.stringify(data));
        				$scope.$apply(function(){
        					$scope.order = data;
        					if($scope.order.owner.username == currentUser.username){
        						$scope.isOwnerOrder = true;
        					}
        					$scope.orderStatus = $scope.order.status.name;
        					$scope.orderStatusId = $scope.order.status.id;
        				});
        			},function(err){
        				console.log("getOrderDetail err: " + JSON.stringify(err));
        			});
        		}
        		if(orderCode){
        			getOrderDetail(orderCode);
        		}
        		
        		var goToOrderList = function(){
        			location.href = "/#!/orders/";
        		}
        		
        		// Cancel swapping order        		
        		$scope.onCancel = function(orderId){
            		var cancelOrder = $window.confirm('Are you sure you want to cancel the Order?');
            	    if(cancelOrder){
            	    	if($scope.orderStatus == $scope.statusType.SWAPPING){
            	    		OrdersService.cancelSwappingOrder(orderId).then(function(resp){
            	    			goToOrderList();
    	                    }, function(err){
    	                        console.log('Failure in saving your message');
    	                    });
            	    	}else if($scope.orderStatus == $scope.statusType.CONFIRMED){
            	    		OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
            	    			goToOrderList();
    	                    }, function(err){
    	                        console.log('Failure in saving your message');
    	                    });
            	    	}else if($scope.orderStatus == $scope.statusType.SUBMITTED){
            	    		OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
            	    			goToOrderList();
                            }, function(err){
                                console.log('Failure in saving your message');
                            });
            	    	}
            	    }
        		};
        		
        		// Confirm swapping order
        		$scope.onConfirm = function(orderId){
            		var swappingOrder = $window.confirm('Are you sure you want to clear the Order?');
            	    if(swappingOrder){
		                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
		                	goToOrderList();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		
        		// Clear confirmed order
        		$scope.onClear = function(orderId){
            		var clearOrder = $window.confirm('Are you sure you want to clear the Order?');
            	    if(clearOrder){
		                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
		                	goToOrderList();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
            }]
    });
