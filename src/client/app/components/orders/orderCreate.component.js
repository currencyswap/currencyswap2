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
	        	window.scrollTo(0, 0);
        		$scope.FIXED_VALUE = GLOBAL_CONSTANT.ORDER_FIXED_VALUE;
        		$scope.EXPIRED_VALUE = GLOBAL_CONSTANT.ORDER_EXPIRED_VALUE;
        		
        		$scope.currentDate = new Date();
        		
        		$scope.suggestOrders = [];
        		
        		$scope.STATUS_PAGE_VALUE = {
        				"CREATE" : "CREATE",
        				"INITIALIZED" : "INITIALIZED"
        		}
        		
        		$scope.submitLoading = false;
        		$scope.hasError = false;
        		$scope.isDevice = $.device;
        		$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        		
        		var getCurrenciesList = function(){
        			OrdersService.getCurrenciesList().then(function(data){
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
        			var data = {
        					value : $scope.newOrder.give,
        					giveCurrencyId : $scope.newOrder.giveCurrencyId,
        					getCurrencyId : $scope.newOrder.getCurrencyId
        			}
        			
        			OrdersService.getSuggetOrders(data).then(function(data1){
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
        		
        		if($rootScope.newOrderSave){
        			$scope.newOrder = $rootScope.newOrderSave;
        		}
        		
        		$scope.onChangeValue = function(fieldChange){
        			var get = parseFloat($scope.newOrder.get);
        			var give = parseFloat($scope.newOrder.give);
        			var rate = parseFloat($scope.newOrder.rate);
        			
        			if($scope.newOrder.fixed == $scope.FIXED_VALUE.GIVE){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					if(give > 0 && rate > 0){
        						$scope.newOrder.get = give * rate;
        					}
        				}else{
        					if(give > 0 && get > 0){
            					$scope.newOrder.rate = get / give;
            				}
        				}
        			}else if($scope.newOrder.fixed == $scope.FIXED_VALUE.GET){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					if(rate > 0 && get > 0){
        						$scope.newOrder.give = get / rate;
        					}
        				}else{
        					if(give > 0 && get > 0){
            					$scope.newOrder.rate = get / give;
            				}
        				}
        			}else{
        				$scope.newOrder.fixed = $scope.FIXED_VALUE.RATE;
        				if(fieldChange == $scope.FIXED_VALUE.GIVE){
        					if(give > 0 && rate > 0){
        						$scope.newOrder.get = give * rate;
        					}
        				}else{
        					if(rate > 0 && get > 0){
            					$scope.newOrder.give = get / rate;
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
        			window.scrollTo(0, 0);
        			$scope.onChangeValue();
        			var dayLive = getExpiredDate();
        			var expiredDate = new Date();
        			expiredDate.setDate(expiredDate.getDate() + dayLive);
        			
        			$scope.newOrder.dayLive = dayLive;
        			$scope.newOrder.expiredDate = expiredDate;
        			
        			for(var i in  $scope.currencies){
        				if($scope.newOrder.getCurrencyCode == $scope.currencies[i].code){
        					$scope.newOrder.getCurrencyId = $scope.currencies[i].id;
        				}
        				
        				if($scope.newOrder.giveCurrencyCode == $scope.currencies[i].code){
        					$scope.newOrder.giveCurrencyId = $scope.currencies[i].id;
        				}
        			}
        			
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.INITIALIZED;
        			$scope.submitLoading = false;
        			$scope.hasError = false;
        			
        			getSuggestionOrders();
            	}
        		
        		$scope.onBackStep = function(){
        			
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        			$scope.submitLoading = false;
        			$scope.hasError = false;
        			window.scrollTo(0, 0);
            	}
        		
        		var goToOrderList = function(){
        			location.href = "/#!/orders/";
        		}
        		
        		$scope.onSubmit = function(){
        			$scope.submitLoading = true;
        			$scope.hasError = false;
        			var newOrderRequest = {};
        			
        			newOrderRequest.give = $scope.newOrder.give;
        			newOrderRequest.get = $scope.newOrder.get;
        			newOrderRequest.rate = $scope.newOrder.rate;
        			newOrderRequest.dayLive = $scope.newOrder.dayLive;
        			newOrderRequest.getCurrencyId = $scope.newOrder.getCurrencyId;
        			newOrderRequest.giveCurrencyId = $scope.newOrder.giveCurrencyId;
        			
        			OrdersService.postSaveNewOrders(newOrderRequest).then(function(data){
        				$scope.submitLoading = false;
        				goToOrderList();
        			},function(err){
        				$scope.submitLoading = false;
        				$scope.hasError = true;
        				$scope.errorMessage = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_ERROR.message;
        			});
            	}
        		
        		$scope.checkEqualCurrency = function(){
        			return $scope.newOrder.giveCurrencyCode == $scope.newOrder.getCurrencyCode;
        		}
        		
        		$scope.checkValiedValue = function(){
        			var give = parseFloat($scope.newOrder.give);
        			var get = parseFloat($scope.newOrder.get);
        			var rate = parseFloat($scope.newOrder.rate);
        			
        			if(rate <= 0 || get <= 0 || give <= 0){
        				return false;
        			}
        			
        			return true;
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
