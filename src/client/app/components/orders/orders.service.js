
'use strict';

angular.module('orders').factory('OrdersService', ['$http', function ($http, PermissionService) {
    return {
        getSwappingOrders: function (headers) { //status == 2
            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_ORDERS_SWAPPING,
                headers: headers,
                data: {}
            };

            return $http(req);
        },
        getConfirmedOrders: function(headers){ // status = 3 || 4
        	var req = {
                    method: httpMethods.GET,
                    url: apiRoutes.API_ORDERS_CONFIRMED,
                    headers: headers,
                    data: {}
                };
                return $http(req);
        },
        getHistoryOrders: function (headers) { // status = 5 || 6 
            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_ORDERS_HISTORY,
                headers: headers
            };
            return $http(req);
        },
        getSumittedOrders: function (headers) { // status = 1 
            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_ORDERS_SUBMITTED,
                headers: headers
            };
            return $http(req);
        },
        getOrderById : function(orderId, headers){
        	var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_ORDERS_ID +  '/' + orderId,
                headers: headers
            };	
        	return $http(req);
        },
        getAllOrders: function(headers){
        	var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_ORDERS,
                headers: headers
            };
        	return $http(req);
        }
    }
}]);
