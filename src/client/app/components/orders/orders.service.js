
'use strict';

angular.module('orders').factory('OrdersService', ['ConnectorService', function (ConnectorService, PermissionService) {
    return $.extend({}, ConnectorService, getSwappingOrders: function (headers) { //status == 2
            return this.get(apiRoutes.API_ORDERS_SWAPPING);
        },
        getConfirmedOrders: function(headers){ // status = 3 || 4
            return this.get(apiRoutes.API_ORDERS_CONFIRMED);
        },
        getHistoryOrders: function (headers) { // status = 5 || 6 
            return this.get(apiRoutes.API_ORDERS_HISTORY);
        },
        getSumittedOrders: function (headers) { // status = 1 
            return this.get(apiRoutes.API_ORDERS_SUBMITTED);
        },
        getOrderById : function(orderId, headers){
            return this.get(apiRoutes.API_ORDERS_ID +  '/' + orderId);
        },
        getAllOrders: function(headers){
            return this.get(apiRoutes.API_ORDERS);
        });
}]);
