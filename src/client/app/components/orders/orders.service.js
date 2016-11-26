
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
            return this.get(apiRoutes.API_ORDERS +  '/' + orderId);
        },
        getAllOrders: function(){
            return this.get(apiRoutes.API_ORDERS);
        },
        getCurrenciesList: function(){
            return this.get(apiRoutes.API_CURRENCIES);
        },
        getSuggetOrders: function() { // status = 1 
            return this.get(apiRoutes.API_ORDERS_SUGGEST);
        },
        postSaveNewOrders: function(newOrder){
        	var data = newOrder;
            return this.post(apiRoutes.API_ORDERS, data);
        },
        getCurrenciesList: function(){
            return this.get(apiRoutes.API_CURRENCIES);
        },
        getSuggetOrders: function() { // status = 1 
            return this.get(apiRoutes.API_ORDERS_SUGGEST);
        },
        postSaveNewOrders: function(newOrder){
        	var data = newOrder;
            return this.post(apiRoutes.API_ORDERS, data);
        },
        cancelSwappingOrder:function(orderId){
        	return this.get(apiRoutes.API_ORDERS_SWAPPING_CANCEL.replace(":id",orderId));
		},
		confirmSwappingOrder:function(orderId){
			return this.get(apiRoutes.API_ORDERS_SWAPPING_CONFIRM.replace(":id",orderId));
		},
		cancelConfirmedOrder: function(orderId){
			return this.get(apiRoutes.API_ORDERS_CONFIRMED_CANCEL.replace(":id",orderId));
		},
		clearConfirmedOrder:function(orderId){
			return this.get(apiRoutes.API_ORDERS_CONFIRMED_CLEAR.replace(":id",orderId));
		},
		cancelSubmittedOrder: function(orderId){
			return this.get(apiRoutes.API_ORDERS_SUBMITTED_CANCEL.replace(":id",orderId));
		},
		editSubmittedOrder: function(orderId){
			return this.get(apiRoutes.API_ORDERS_SUBMITTED_EDIT.replace(":id",orderId));
		}
    });
}]);
