'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var app = require('../server');
var dbUtil = require('../libs/utilities/db-util');
exports.filterOrders = function (filter) {
	return dbUtil.executeModelFn(app.models.Order, 'find', filter);
};
exports.getOrderById = function (filter) {
	return dbUtil.executeModelFn(app.models.Order, 'findOne', filter);
};



