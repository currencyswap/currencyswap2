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
        		
	        	$rootScope.currencies = [
	        	    {
						"code" : "USD",
						"name" : "US Dollar"
					}, {
						"code" : "EUR",
						"name" : "Euro"
					}, {
						"code" : "GBP",
						"name" : "British Pound"
					}, {
						"code" : "INR",
						"name" : "Indian Rupee"
					}, {
						"code" : "AUD",
						"name" : "Australian Dollar"
					}, {
						"code" : "CAD",
						"name" : "Canadian Dollar"
					}, {
						"code" : "SGD",
						"name" : "Singapore Dollar"
					}
				];
        		
        		$scope.currencies = $rootScope.currencies;
        		$scope.FIXED_VALUE = GLOBAL_CONSTANT.ORDER_FIXED_VALUE;
        		$scope.EXPIRED_VALUE = GLOBAL_CONSTANT.ORDER_EXPIRED_VALUE;
        		
        		$scope.currentDate = new Date();
        		
        		$scope.STATUS_PAGE_VALUE = {
        				"CREATE" : "CREATE",
        				"INITIALIZED" : "INITIALIZED"
        		}
        		
        		$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
        		
        		$scope.newOrder = {
        				give : 1000,
        				giveCurrencyCode : $scope.currencies[0].code,
        				get : 10,
        				getCurrencyCode : $scope.currencies[1].code,
        				rate : 0,
        				fixed : $scope.FIXED_VALUE.RATE,
        				expired : $scope.EXPIRED_VALUE[0].key,
        				expiredDate : new Date()
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
        			$scope.newOrder.expiredDate = expiredDate;
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.INITIALIZED;
            	}
        		
        		$scope.onBackStep = function(){
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
            	}
        		
        		$scope.onSubmit = function(){
        			$scope.statusPage = $scope.STATUS_PAGE_VALUE.CREATE;
            	}
        		
        		$scope.checkEqualCurrency = function(){
        			return $scope.newOrder.giveCurrencyCode == $scope.newOrder.getCurrencyCode;
        		}
        		
            }]
    });
