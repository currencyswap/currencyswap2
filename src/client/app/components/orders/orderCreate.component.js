'use strict';

angular.module('orders')
    .component('orderCreate', {
        templateUrl: 'app/components/orders/orderCreate.template.html',
        controller: ['$scope',
            '$rootScope',
            'OrdersService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function orderCreateController($scope, $rootScope, OrdersService, $location, $http, $window, GLOBAL_CONSTANT) {
        		
	        	$scope.currencies = [];
        		
        		$scope.FIXED_VALUE = GLOBAL_CONSTANT.ORDER_FIXED_VALUE;
        		$scope.EXPIRED_VALUE = GLOBAL_CONSTANT.ORDER_EXPIRED_VALUE;
        		
        		$scope.currentDate = new Date();
        		
        		$scope.suggestOrders = [];
        		
        		$scope.STATUS_PAGE_VALUE = {
        				"CREATE" : "CREATE",
        				"INITIALIZED" : "INITIALIZED"
        		}
        		
        		$scope.submitLoading = false;
        		
        		$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        		
        		var getCurrenciesList = function(){
        			OrdersService.getCurrenciesList().then(function(data){
        				console.log("getCurrenciesList success: " + JSON.stringify(data));
        				$scope.$apply(function(){
        					$scope.currencies = data;
        					if($scope.currencies.length > 2){
        						$scope.newOrder.giveCurrencyCode = $scope.currencies[0].code;
        						$scope.newOrder.getCurrencyCode = $scope.currencies[1].code;
        					}
        				});
        			},function(err){
        				console.log("getCurrenciesList err: " + JSON.stringify(err));
        			});
        		}
        		
        		getCurrenciesList();
        		
        		var getSuggestionOrders = function(){
        			var value = "";
        			if($scope.newOrder.fixed == $scope.FIXED_VALUE.GIVE){
        				value = $scope.newOrder.give;
        			}else if($scope.newOrder.fixed == $scope.FIXED_VALUE.GET){
        				value = $scope.newOrder.give;
        			}else{
        				$scope.newOrder.fixed = $scope.FIXED_VALUE.RATE;
        				value = $scope.newOrder.rate;
        			}
        			
        			var data = {
        					fixed : $scope.newOrder.fixed,
        					value : value
        			}
        			
        			OrdersService.getSuggetOrders(data).then(function(data1){
        				console.log("getSuggestionOrders : " + JSON.stringify(data1));
        				$scope.$apply(function(){
        					$scope.suggestionOrders = data1;
        				});
        			},function(err){
        				console.log("getSuggestionOrders err: " + JSON.stringify(err));
        			});
        		}
        		
        		if(!$scope.newOrder){
	        		$scope.newOrder = {
	        				give : "",
	        				giveCurrencyCode : "",
	        				get : "",
	        				getCurrencyCode : "",
	        				rate : "",
	        				fixed : $scope.FIXED_VALUE.GIVE,
	        				expired : $scope.EXPIRED_VALUE[0].key,
	        				expiredDate : new Date(),
	        				dayLive : 0
	        		};
        		}
        		console.log("orderCreateController ....");
        		
        		if($rootScope.newOrderSave){
        			$scope.newOrder = $rootScope.newOrderSave;
        		}
        		
        		$scope.onChangeValue = function(fieldChange){
        			if($scope.newOrder.fixed == $scope.FIXED_VALUE.GIVE){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					$scope.newOrder.get = $scope.newOrder.give * $scope.newOrder.rate;
        				}else{
        					if($scope.newOrder.give){
            					$scope.newOrder.rate = $scope.newOrder.get / $scope.newOrder.give;
            				}
        				}
        			}else if($scope.newOrder.fixed == $scope.FIXED_VALUE.GET){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					if($scope.newOrder.rate){
        						$scope.newOrder.give = $scope.newOrder.get / $scope.newOrder.rate;
        					}
        				}else{
        					if($scope.newOrder.give){
            					$scope.newOrder.rate = $scope.newOrder.get / $scope.newOrder.give;
            				}
        				}
        			}else{
        				$scope.newOrder.fixed = $scope.FIXED_VALUE.RATE;
        				if(fieldChange == $scope.FIXED_VALUE.GIVE){
        					$scope.newOrder.get = $scope.newOrder.give * $scope.newOrder.rate;
        				}else{
        					if($scope.newOrder.rate){
            					$scope.newOrder.give = $scope.newOrder.get / $scope.newOrder.rate;
            				}
        				}
        			}
        		}
        		
        		var getExpiredDate = function(){
        			for(var i in $scope.EXPIRED_VALUE){
        				if($scope.newOrder.expired == $scope.EXPIRED_VALUE[i].key){
        					return $scope.EXPIRED_VALUE[i].dayLive;
        				}
        			}
        			
        			return 0;
        		}
        		
        		$scope.onNextStep = function(){
        			$scope.onChangeValue();
        			var dayLive = getExpiredDate();
        			var expiredDate = new Date();
        			expiredDate.setDate(expiredDate.getDate() + dayLive);
        			
        			$scope.newOrder.dayLive = dayLive;
        			$scope.newOrder.expiredDate = expiredDate;
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.INITIALIZED;
        			$scope.submitLoading = false;
        			getSuggestionOrders();
            	}
        		
        		$scope.onBackStep = function(){
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        			$scope.submitLoading = false;
            	}
        		
        		var goToOrderList = function(){
        			location.href = "/#!/orders/";
        		}
        		
        		$scope.onSubmit = function(){
        			$scope.submitLoading = true;
        			
        			var newOrderRequest = {};
        			
        			newOrderRequest.give = $scope.newOrder.give;
        			newOrderRequest.get = $scope.newOrder.get;
        			newOrderRequest.rate = $scope.newOrder.rate;
        			newOrderRequest.dayLive = $scope.newOrder.dayLive;
        			newOrderRequest.getCurrencyid = 0;
        			newOrderRequest.giveCurrencyid = 0;
        			
        			for(var i in  $scope.currencies){
        				if($scope.newOrder.getCurrencyCode == $scope.currencies[i].code){
        					newOrderRequest.getCurrencyId = $scope.currencies[i].id;
        				}
        				
        				if($scope.newOrder.giveCurrencyCode == $scope.currencies[i].code){
        					newOrderRequest.giveCurrencyId = $scope.currencies[i].id;
        				}
        			}
        			
        			OrdersService.postSaveNewOrders(newOrderRequest).then(function(data){
        				$scope.submitLoading = false;
        				goToOrderList();
        			},function(err){
        				$scope.submitLoading = false;
        				$window.alert("postSaveNewOrders err: " + JSON.stringify(err));
        			});
            	}
        		
        		$scope.checkEqualCurrency = function(){
        			return $scope.newOrder.giveCurrencyCode == $scope.newOrder.getCurrencyCode;
        		}
        		
        		// swapping order
        		$scope.onSwap = function(orderId){
            		var swapOrder = $window.confirm('Are you sure you want to Swap the Order?');
            	    if(swapOrder){
		                OrdersService.swapSubmittedOrder(orderId).then(function(resp){
		                	goToOrderList();
	                    }, function(err){
	                        console.log('Failure in saving your message');
	                    });
            	    }
        		};
        		
            }]
    });
