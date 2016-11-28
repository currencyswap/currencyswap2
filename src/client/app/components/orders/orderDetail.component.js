'use strict';

angular.module('orders')
    .component('orderDetail', {
        templateUrl: 'app/components/orders/orderDetail.template.html',
        controller: ['$scope',
            '$rootScope',
            '$route',
            'OrdersService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function orderDetailController($scope, $rootScope, $route, OrdersService, $location, $http, $window, GLOBAL_CONSTANT) {
        		console.log("orderDetailController ....");
        		var orderCode = undefined;
        		if($route.current.params){
        			orderCode = $route.current.params.orderCode;
        		}
        		
        		var getOrderDetail = function(orderCode){
        			OrdersService.getOrderByCode(orderCode).then(function(data){
        				console.log("getOrderDetail success: " + JSON.stringify(data));
        				$scope.$apply(function(){
        					$scope.order = data;
        				});
        			},function(err){
        				console.log("getOrderDetail err: " + JSON.stringify(err));
        			});
        		}
        		if(orderCode){
        			getOrderDetail(orderCode);
        		}
            }]
    });
