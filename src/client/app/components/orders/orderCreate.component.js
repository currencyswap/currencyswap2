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
        		
	        	$scope.currencies = [
//	        	    {
//						"code" : "USD",
//						"name" : "US Dollar"
//					}, {
//						"code" : "EUR",
//						"name" : "Euro"
//					}, {
//						"code" : "GBP",
//						"name" : "British Pound"
//					}, {
//						"code" : "INR",
//						"name" : "Indian Rupee"
//					}, {
//						"code" : "AUD",
//						"name" : "Australian Dollar"
//					}, {
//						"code" : "CAD",
//						"name" : "Canadian Dollar"
//					}, {
//						"code" : "SGD",
//						"name" : "Singapore Dollar"
//					}
				];
        		
        		$scope.FIXED_VALUE = GLOBAL_CONSTANT.ORDER_FIXED_VALUE;
        		$scope.EXPIRED_VALUE = GLOBAL_CONSTANT.ORDER_EXPIRED_VALUE;
        		
        		$scope.currentDate = new Date();
        		
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
        				});
        			},function(err){
        				console.log("getCurrenciesList err: " + JSON.stringify(err));
        			});
        		}
        		
        		getCurrenciesList();
        		
        		$scope.newOrder = {
        				give : 0,
        				giveCurrencyCode : "",
        				get : 0,
        				getCurrencyCode : "",
        				rate : 0,
        				fixed : $scope.FIXED_VALUE.RATE,
        				expired : $scope.EXPIRED_VALUE[0].key,
        				expiredDate : new Date(),
        				dayLive : 0
        		};
        		console.log("orderCreateController ....");
        		
        		if($rootScope.newOrderSave){
        			$scope.newOrder = $rootScope.newOrderSave;
        		}
        		
        		$scope.onChangeValue = function(){
        			if($scope.newOrder.fixed == $scope.FIXED_VALUE.GET){
        				$scope.newOrder.get = $scope.newOrder.give * $scope.newOrder.rate;
        			}else if($scope.newOrder.fixed == $scope.FIXED_VALUE.GIVE){
        				if($scope.newOrder.rate){
        					$scope.newOrder.give = $scope.newOrder.get / $scope.newOrder.rate;
        				}
        			}else{
        				$scope.newOrder.fixed = $scope.FIXED_VALUE.RATE;
        				if($scope.newOrder.give){
        					$scope.newOrder.rate = $scope.newOrder.get / $scope.newOrder.give;
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
            	}
        		
        		$scope.onBackStep = function(){
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        			$scope.submitLoading = false;
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
        				console.log("postSaveNewOrders success: " + JSON.stringify(data));
        				location.href = "/#!/orders";
        			},function(err){
        				$scope.submitLoading = false;
        				console.log("postSaveNewOrders err: " + JSON.stringify(err));
        			});
            	}
        		
        		$scope.checkEqualCurrency = function(){
        			return $scope.newOrder.giveCurrencyCode == $scope.newOrder.getCurrencyCode;
        		}
        		
            }]
    });
