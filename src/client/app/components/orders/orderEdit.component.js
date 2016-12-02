'use strict';

angular.module('orders')
    .component('orderEdit', {
        templateUrl: 'app/components/orders/orderEdit.template.html',
        controller: ['$scope',
            '$rootScope',
            '$routeParams',
            'OrdersService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function orderEditController($scope, $rootScope, $routeParams, OrdersService, $location, $http, $window, GLOBAL_CONSTANT) {
        		$scope.orderCode = $routeParams.orderCode;
        		window.scrollTo(0, 0);
	        	$scope.currencies = [];
	        	$scope.order = undefined;
	        	
	        	$scope.orderNotExisted = false;
        		
        		$scope.FIXED_VALUE = GLOBAL_CONSTANT.ORDER_FIXED_VALUE;
        		$scope.EXPIRED_VALUE = GLOBAL_CONSTANT.ORDER_EXPIRED_VALUE;
        		
        		$scope.currentDate = new Date();
        		
        		$scope.submitLoading = false;
        		$scope.hasError = false;
        		
        		var setExpired = function(created, expired){
        			var time = expired.getTime() - created.getTime();
        			var TIME_A_DAY = 1000 * 60 * 60 * 24;
        			var dayLive = time % TIME_A_DAY == 0 ? time/TIME_A_DAY : time/TIME_A_DAY + 1;
        			
        			for(var i in $scope.EXPIRED_VALUE){
        				if(dayLive == $scope.EXPIRED_VALUE[i].dayLive){
        					return $scope.EXPIRED_VALUE[i].key;
        				}
        			}
        			
        			return $scope.EXPIRED_VALUE[0].key;
        		}
        		
        		var getCurrenciesList = function(){
        			OrdersService.getCurrenciesList().then(function(data){
        				$scope.$apply(function(){
        					$scope.currencies = data;
        				});
        			},function(err){
        				console.log("getCurrenciesList err: " + JSON.stringify(err));
        			});
        		}
        		
        		getCurrenciesList();
        		
        		var getOrderDetail = function(orderCode){
        			OrdersService.getOrderForEdit(orderCode).then(function(data){
        				$scope.$apply(function(){
        					if(data){
        						$scope.orderNotExisted = false;
        						$scope.order = data;
        						
        						$scope.updateOrder.give = $scope.order.give;
        						$scope.updateOrder.rate = $scope.order.rate;
        						$scope.updateOrder.get = $scope.order.get;
        						$scope.updateOrder.giveCurrencyCode = $scope.order.giveCurrency.code;
        						$scope.updateOrder.getCurrencyCode = $scope.order.getCurrency.code;
        						
        						var created = new Date($scope.order.created);
        	        			var expired = new Date($scope.order.expired);
        	        			$scope.updateOrder.expired = setExpired(created, expired);
        						
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
        		
        		$scope.updateOrder = {
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
        		
        		$scope.onChangeValue = function(fieldChange){
        			var get = parseFloat($scope.updateOrder.get);
        			var give = parseFloat($scope.updateOrder.give);
        			var rate = parseFloat($scope.updateOrder.rate);
        			
        			if(rate > 0){
        				var rateRound = Math.round(rate * 1000);
	        			
	        			rate = rateRound / 1000;
        			}
        			
        			if($scope.updateOrder.fixed == $scope.FIXED_VALUE.GIVE){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					if(give > 0 && rate > 0){
        						$scope.updateOrder.get = give * rate;
        					}
        				}else{
        					if(give > 0 && get > 0){
            					$scope.updateOrder.rate = get / give;
            				}
        				}
        			}else if($scope.updateOrder.fixed == $scope.FIXED_VALUE.GET){
        				if(fieldChange == $scope.FIXED_VALUE.RATE){
        					if(rate > 0 && get > 0){
        						$scope.updateOrder.give = get / rate;
        					}
        				}else{
        					if(give > 0 && get > 0){
            					$scope.updateOrder.rate = get / give;
            				}
        				}
        			}else{
        				$scope.updateOrder.fixed = $scope.FIXED_VALUE.RATE;
        				if(fieldChange == $scope.FIXED_VALUE.GIVE){
        					if(give > 0 && rate > 0){
        						$scope.updateOrder.get = give * rate;
        					}
        				}else{
        					if(rate > 0 && get > 0){
            					$scope.updateOrder.give = get / rate;
            				}
        				}
        			}
        		}
        		
        		var getExpiredDate = function(){
        			for(var i in $scope.EXPIRED_VALUE){
        				if($scope.updateOrder.expired == $scope.EXPIRED_VALUE[i].key){
        					return $scope.EXPIRED_VALUE[i].dayLive;
        				}
        			}
        			
        			return 0;
        		}
        		
        		var goToOrderDetail = function(code){
        			location.href = "/#!/orders/" + code;
        		}
        		
        		$scope.onSubmit = function(){
        			$scope.submitLoading = window.scrollTo(0, 0);
        			true;
        			$scope.hasError = false;
        			var updateOrderRequest = {};
        			
        			$scope.updateOrder.dayLive = getExpiredDate();
        			
        			updateOrderRequest.give = $scope.updateOrder.give;
        			updateOrderRequest.get = $scope.updateOrder.get;
        			updateOrderRequest.rate = $scope.updateOrder.rate;
        			updateOrderRequest.dayLive = $scope.updateOrder.dayLive;
        			updateOrderRequest.getCurrencyid = 0;
        			updateOrderRequest.giveCurrencyid = 0;
        			
        			for(var i in  $scope.currencies){
        				if($scope.updateOrder.getCurrencyCode == $scope.currencies[i].code){
        					updateOrderRequest.getCurrencyId = $scope.currencies[i].id;
        				}
        				
        				if($scope.updateOrder.giveCurrencyCode == $scope.currencies[i].code){
        					updateOrderRequest.giveCurrencyId = $scope.currencies[i].id;
        				}
        			}
        			
        			OrdersService.putUpdateOrder($scope.orderCode, updateOrderRequest).then(function(data){
        				$scope.submitLoading = false;
        				goToOrderDetail($scope.orderCode);
        			},function(err){
        				$scope.submitLoading = false;
        				$scope.hasError = true;
        				$scope.errorMessage = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_ERROR.message;
        			});
            	}
        		
        		$scope.checkEqualCurrency = function(){
        			return $scope.updateOrder.giveCurrencyCode == $scope.updateOrder.getCurrencyCode;
        		}
        		
        		$scope.checkValiedValue = function(){
        			var give = parseFloat($scope.updateOrder.give);
        			var get = parseFloat($scope.updateOrder.get);
        			var rate = parseFloat($scope.updateOrder.rate);
        			
        			if(rate <= 0 || get <= 0 || give <= 0){
        				return false;
        			}
        			
        			return true;
        		}
            }]
    });
