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
            }]
    });
