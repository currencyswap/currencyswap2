module.exports = function(Order) {
	Order.observe('after save', function (ctx, next) {
        if (!ctx.instance) {
            return next();
        }
        next();
    });
	Order.getSwappingOrders =  function (userId) {
		var orders = [{
			"code": "W321R3",
			"ownerId": "2",
			"accepterId": "",
			"giveCurrencyId":"1",
			"getCurrencyId" :"2",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1100,
			"get": 700,
			"rate": 0.72

		},{
			"code": "W321R2",
			"ownerId": "3",
			"accepterId": "",
			"giveCurrencyId":"2",
			"getCurrencyId":"1",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1200,
			"get": 700,
			"rate": 0.73

		},{
			"code": "W321R4",
			"ownerId": "4",
			"accepterId": "",
			"giveCurrencyId":"7",
			"getCurrencyId":"1",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1000,
			"get": 700,
			"rate": 0.71

		},{
			"code": "W321R1",
			"ownerId": "5",
			"accepterId": "",
			"giveCurrencyId":"1",
			"getCurrencyId":"3",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1210,
			"get": 700,
			"rate": 0.711

		},{
			"code": "W321R5",
			"ownerId": "6",
			"accepterId": "",
			"giveCurrencyId":"7",
			"getCurrencyId":"2",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1000,
			"get": 600,
			"rate": 0.76

		},{
			"code": "W321R6",
			"ownerId": "3",
			"accepterId": "",
			"giveCurrencyId":"2",
			"getCurrencyId":"3",
			"statusId":"2",
			"created": new Date(),
			"updated": new Date(),
			"expired": new Date(),
			"give": 1000,
			"get": 750,
			"rate": 0.71
			
		}
		];
		return orders;

//        var where = {
// 			   			and: [{ or: [{'ownerId': userId}, 
// 			   			             {'accepterId': userId}] 
// 			   					},
// 			   			      { statusId: '2' }
// 				   ]
// 				 };
//        var filter = {
//            where: where
//        };
//        Order.find(filter, function (err, orders) {
//            if (err) return callback(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
//            else {
//                if (!orders || orders.length < 0) return callback(errorUtil.createAppError(errors.NO_ORDER_FOUND_IN_DB));
//                else return callback(null, orders);
//            }
//        });
//
	}
};
