
'use strict';

angular.module('orders').factory('OrdersService', ['ConnectorService', function (ConnectorService, PermissionService) {
    return $.extend({}, ConnectorService, {
        getSwappingOrders: function() { //status == 2
            return this.get(apiRoutes.API_ORDERS_SWAPPING);
        },
        getConfirmedOrders: function(){ // status = 3 || 4
            return this.get(apiRoutes.API_ORDERS_CONFIRMED);
        },
        getHistoryOrders: function() { // status = 5 || 6 
            return this.get(apiRoutes.API_ORDERS_HISTORY);
        },
        getSumittedOrders: function() { // status = 1 
            return this.get(apiRoutes.API_ORDERS_SUBMITTED);
        },
        getOrderById : function(orderId){
            return this.get(apiRoutes.API_ORDERS_ID +  '/' + orderId);
        },
        getAllOrders: function(){
            return this.get(apiRoutes.API_ORDERS);
        }
    });
}]);
