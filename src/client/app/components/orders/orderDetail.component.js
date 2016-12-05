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
//        			getOrderDetail($scope.orderCode);
        		}
        		
        		var goToEdit = function(code){
        			location.href = "/#!/orders/edit/" + code;
        		}
        		
        		// Cancel swapping order        		
        		$scope.onCancel = function(orderId){
        			var msg = '';
        			if($scope.isOwnerOrder && $scope.orderStatus == $scope.statusType.SWAPPING)
        				msg = 'State of this order will be changed to Submitted. Do you want continue?';
        			else if(!$scope.isOwnerOrder && $scope.orderStatus == $scope.statusType.SWAPPING)
        				msg = 'If you cancel, this order will be removed from your list. Do you want continue?';
        			else if($scope.orderStatus == $scope.statusType.SUBMITTED)
        				msg='If you cancel, this order will be deleted. Do you want continue?'
        			else 
        				msg = 'State of this order will be changed to Cancelled. Do you want continue?';
        			
            		var cancelOrder = $window.confirm(msg);
            	    if(cancelOrder){
            	    	$scope.submitLoading = true;
            	    	if($scope.orderStatus == $scope.statusType.SWAPPING){
            	    		OrdersService.cancelSwappingOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			if($scope.isOwnerOrder){
            	    				getOrderDetail($scope.orderCode);	
            	    			} else {
            	    				goToOrderList();
            	    			}
            	    			
    	                    }, function(err){
    	                    	$scope.submitLoading = false;
    	                        $window.alert('Failure to cancel action!');
    	                    });
            	    	}else if($scope.orderStatus == $scope.statusType.SUBMITTED){
            	    		OrdersService.cancelSubmittedOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			location.href = "/#!/orders/";
                            }, function(err){
                            	$scope.submitLoading = false;
                            	$window.alert('Failure to cancel action!');
                            });
            	    	}else{
            	    		OrdersService.cancelConfirmedOrder(orderId).then(function(resp){
            	    			$scope.submitLoading = false;
            	    			getOrderDetail($scope.orderCode);
    	                    }, function(err){
    	                    	$scope.submitLoading = false;
    	                    	$window.alert('Failure to cancel action!');
    	                    });
            	    	}
            	    }
        		};
        		
        		// Confirm swapping order
        		$scope.onConfirm = function(orderId){
        			var msg = 'State of this order will be changed to Confirmed. Do you want continue?';
            		var confirmOrder = $window.confirm(msg);
            	    if(confirmOrder){
            	    	$scope.submitLoading = true;
		                OrdersService.confirmSwappingOrder(orderId).then(function(resp){
		                	$scope.submitLoading = false;
		                	getOrderDetail($scope.orderCode);
	                    }, function(err){
	                    	$scope.submitLoading = false;
	                    	$window.alert('Failure to confirm action!');
	                    });
            	    }
        		};
        		
        		// Clear confirmed order
        		$scope.onClear = function(orderId){
        			var msg= 'State of this order will be changed to Cleared. Do you want continue?';
//        			State of this order will be changed to Pending. Do you want continue?
            		var clearOrder = $window.confirm(msg);
            	    if(clearOrder){
            	    	$scope.submitLoading = true;
		                OrdersService.clearConfirmedOrder(orderId).then(function(resp){
		                	$scope.submitLoading = false;
		                	getOrderDetail($scope.orderCode);
	                    }, function(err){
	                    	$scope.submitLoading = false;
	                    	$window.alert('Failure to clear action!');
	                    });
            	    }
        		};
        		
        		// Clear edit order
        		$scope.onEdit = function(orderCode){
            		//var editOrder = $window.confirm('Are you sure you want to edit the Order?');
            	    //if(editOrder){
            	    	goToEdit(orderCode);
            	    //}
        		};
        		
        		$scope.checkStatusCurrentUserInActivity = function(activities){
        			var isCleared = false;
        			if(activities){
            			for(var i = 0; i < activities.length; i++){
            				var activity = activities[i];
            				
            				if(activity.creator.username == $scope.currentUser.username && activity.statusId == 4){
            					isCleared = true;
            				}
            			}
        			}
        			return isCleared;
        		}
            }]
    });
