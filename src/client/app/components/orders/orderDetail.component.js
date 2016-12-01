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
        		window.scrollTo(0, 0);
        		$scope.submitLoading = false;
        		
        		$scope.orderNotExisted = false;
        		
        		$scope.orderCode = $routeParams.orderCode;
        		//orderCode = $route.current.params.orderCode;
        		$scope.currentUser = CookieService.getCurrentUser();
        		
        		$scope.statusType = GLOBAL_CONSTANT.STATUS_TYPE;
        		$scope.orderStatus = "";
        		$scope.isOwnerOrder = false;
        		
        		var getOrderDetail = function(orderCode){
        			OrdersService.getOrderByCode(orderCode).then(function(data){
        				console.log("getOrderDetail success: " + JSON.stringify(data));
        				$scope.$apply(function(){
        					if(data){
        						$scope.orderNotExisted = false;
        						$scope.order = data;
            					if($scope.order.owner.username == $scope.currentUser.username){
            						$scope.isOwnerOrder = true;
            					}
            					$scope.orderStatus = $scope.order.status.name;
            					$scope.orderStatusId = $scope.order.status.id;
        					}else{
        						$scope.orderNotExisted = true;
        					}
        				});
        			},function(err){
        				$scope.orderNotExisted = true;
        				console.log("getOrderDetail err: " + JSON.stringify(err));
        			});
        		}
        		if($scope.orderCode){
        			getOrderDetail($scope.orderCode);
        		}
        		
        		var goToOrderList = function(){
        			location.href = "/#!/orders/";
        		}
        		
        		var goToEdit = function(code){
        			location.href = "/#!/orders/edit/" + code;
        		}
        		
        		// Cancel swapping order        		
        		$scope.onCancel = function(orderId){
            		var cancelOrder = $window.confirm('Are you sure you want to cancel the Order?');
            	    if(cancelOrder){
            	    	$scope.submitLoading = true;
            	    	if($scope.orderStatus == $scope.statusType.SWAPPING){
            	    		OrdersService.cancelSwappingOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			goToOrderList();
    	                    }, function(err){
    	                    	$scope.submitLoading = false;
    	                        $window.alert('Failure to cancel action!');
    	                    });
            	    	}else if($scope.orderStatus == $scope.statusType.CONFIRMED){
            	    		OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			goToOrderList();
    	                    }, function(err){
    	                    	$scope.submitLoading = false;
    	                    	$window.alert('Failure to cancel action!');
    	                    });
            	    	}else if($scope.orderStatus == $scope.statusType.SUBMITTED){
            	    		OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			goToOrderList();
                            }, function(err){
                            	$scope.submitLoading = false;
                            	$window.alert('Failure to cancel action!');
                            });
            	    	}
            	    }
        		};
        		
        		// Confirm swapping order
        		$scope.onConfirm = function(orderId){
            		var confirmOrder = $window.confirm('Are you sure you want to confirm the Order?');
            	    if(confirmOrder){
            	    	$scope.submitLoading = true;
		                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
		                	$scope.submitLoading = false;
		                	goToOrderList();
	                    }, function(err){
	                    	$scope.submitLoading = false;
	                    	$window.alert('Failure to confirm action!');
	                    });
            	    }
        		};
        		
        		// Clear confirmed order
        		$scope.onClear = function(orderId){
            		var clearOrder = $window.confirm('Are you sure you want to clear the Order?');
            	    if(clearOrder){
            	    	$scope.submitLoading = true;
		                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
		                	$scope.submitLoading = false;
		                	goToOrderList();
	                    }, function(err){
	                    	$scope.submitLoading = false;
	                    	$window.alert('Failure to clear action!');
	                    });
            	    }
        		};
        		
        		// Clear edit order
        		$scope.onEdit = function(orderCode){
            		var editOrder = $window.confirm('Are you sure you want to edit the Order?');
            	    if(editOrder){
            	    	goToEdit(orderCode);
            	    }
        		};
            }]
    });
