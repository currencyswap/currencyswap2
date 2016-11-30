'use strict';
/**
 * @author Viet Nghiem
 */
var CronJob = require('cron').CronJob;
var async = require('async');

var userService = require('../services/user-service');
var orderService = require('../services/order-service');
var supportService = require('../services/support-service');
var constant = require('../libs/constants/constants');
var config = require('../global-config');

module.exports = function Checker() {
    var MsgExpiringOrderMap = {};
    var MsgExpiringUserMap = {};
    
    var _performInSeries = function(items, handler, done) {
        async.eachSeries(items, function iterator(item, next) {
            handler(item, next);
          }, done);
    };
    var setOrderExpired = function(next) {
        var time = new Date();
        console.log('CronJob Checker::setOrderExpired is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            if (orders.length === 0) {
                console.log('CronJob Checker::setOrderExpired No items found');
                return next();
            }
            _performInSeries(orders, function handler(order, next) {
                orderService.updateOrderStatus(order.id, constant.STATUS_TYPE.EXPIRED_ID).then(function(resp){
                    return next();
                }, function(e){
                    return next();
                });
            }, function done(){
                console.log('CronJob Checker::setOrderExpired Completed');
                return next();
            });
        }, function(e){
            console.log('CronJob Checker::setOrderExpired Error', e);
            return next();
        });
    };
    
    var nofityExpiringOrder = function() {
        var beforeExpTime = new Date();
        beforeExpTime.setDate(beforeExpTime.getDate()+config.notifyExpireBeforeDays);
        var hours = beforeExpTime.getHours();
        // use map to improve performance of this process
        if (MsgExpiringOrderMap['hours'+hours] !== hours) {
            MsgExpiringOrderMap = {};
            MsgExpiringOrderMap['hours'+hours] = hours;
        }

        console.log('CronJob Checker::nofityExpiringOrder is starting...', beforeExpTime);
        orderService.getExpiredOrders(beforeExpTime).then(function(orders){
            if (orders.length === 0) {
                console.log('CronJob Checker::nofityExpiringOrder No items found');
                return;
            }
            supportService.getCreator((config.superUsername || 'admin')).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                _performInSeries(orders, function handler(order, next) {
                    createExpOrderMessage(order, adminId, next);
                }, function done(){
                    console.log('CronJob Checker::nofityExpiringOrder Completed');
                });
            }, function(e){
                console.log('CronJob Checker::nofityExpiringOrder Error', e);
            });
        }, function(e){
            console.log('CronJob Checker::nofityExpiringOrder Error', e);
        });
    };

    var createExpOrderMessage = function(order, adminId, next) {
        order = order.toJSON();
        if (MsgExpiringOrderMap[order.id]) {
            console.log('Message is already sent', order.id, order.code);
            return;
        }
        var ownerId = order.owner.id;
        var title = constant.MSG.ORDER_EXPIRE_SOON_TITLE;
        var msg = 'Order: ' + order.code + ', Give: ' + order.give + ' ' + order.giveCurrency.code+ '-' + order.giveCurrency.name
                + ', Get: ' + order.get + ' ' + order.getCurrency.code+ '-' + order.getCurrency.name +', Rate: ' + order.rate 
                    + ', Created: ' + (order.created.toString()) + ', Expired: ' + (order.expired.toString());

        supportService.existMessage(ownerId, title, msg).then(function(msgInst){
            if (msgInst && msgInst.id) {
                console.log('Message is already sent', ownerId, msg);
                return next();
            } else {
              supportService.saveMessage({'title': title, 
              'message': msg, 
              'creatorId': adminId, 'receiverId': ownerId}).then(function(resp){
                  MsgExpiringOrderMap[order.id] = true;
                  return next();
              }, function(e){
                  return next();
              });//, 'orderCode': order.code
            }
        });
    };
    
    var nofityExpiringUser = function() {
        var beforeExpTime = new Date();
        beforeExpTime.setDate(beforeExpTime.getDate()+config.notifyExpireBeforeDays);
        var hours = beforeExpTime.getHours();
        // use map to improve performance of this process
        if (MsgExpiringUserMap['hours'+hours] !== hours) {
            MsgExpiringUserMap = {};
            MsgExpiringUserMap['hours'+hours] = hours;
        }
        // from begin of the day
        var limitTime = new Date();
        limitTime.setHours(0);
        limitTime.setMinutes(0);
        limitTime.setSeconds(0);
        limitTime.setMilliseconds(0);

        console.log('CronJob Checker::nofityExpiringUser is starting...', beforeExpTime, limitTime);
        userService.getExpiredUsers(beforeExpTime, limitTime).then(function(users){
            if (users.length === 0) {
                console.log('CronJob Checker::nofityExpiringUser No items found');
                return;
            }
            supportService.getCreator((config.superUsername || 'admin')).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                _performInSeries(users, function handler(user, next) {
                    createExpUserMessage(user, adminId, next);
                }, function done(){
                    console.log('CronJob Checker::nofityExpiringUser Completed');
                });
            }, function(e){
                console.log('CronJob Checker::nofityExpiringUser Error', e);
            });
        }, function(e){
            console.log('CronJob Checker::nofityExpiringUser Error', e);
        });
    };

    var createExpUserMessage = function(user, adminId, next) {
        user = user.toJSON();
        if (MsgExpiringUserMap[user.id]) {
            console.log('Message is already sent', user.id, user.code);
            return;
        }
        var ownerId = user.id;
        var title = constant.MSG.USER_EXPIRE_SOON_TITLE;
        var msg = 'User name: ' + user.username + ', Full name: ' + user.fullName + ', Email: ' + user.email
                + ', Joint: ' + (user.registeredDate.toString()) + ', Expired: ' + (user.expiredDate.toString());

        supportService.existMessage(ownerId, title, msg).then(function(msgInst){
            if (msgInst && msgInst.id) {
                console.log('Message is already sent', ownerId, msg);
                return next();
            } else {
              supportService.saveMessage({'title': title, 
              'message': msg, 
              'creatorId': adminId, 'receiverId': ownerId}).then(function(resp){
                  MsgExpiringUserMap[user.id] = true;
                  return next();
              }, function(e){
                  return next();
              });
            }
        });
    };
    
    var init = function() {
        console.log('CronJob Checker::init', new Date());
        var delay = 10;
        var startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+delay);
        // run only 1 time at starting app
        var jobOnce = new CronJob(startTime, function() {
            setOrderExpired(nofityExpiringOrder);
            nofityExpiringUser();
            jobOnce.stop();
          }, function () {
              jobEveryHourAtXXMins.start();
              console.log('CronJob Checker::jobEveryHourAtXXMins is completed', new Date());
          }, true);
        var jobEveryHourAtXXMins = new CronJob((config.scheduleCheckExpired||'00 00,10,20,30,40,50 * * * *'), function() {
            setOrderExpired(nofityExpiringOrder);
            nofityExpiringUser();
          }, function () {
              console.log('CronJob Checker::jobEveryHourAtXXMins is completed', new Date());
          }
        );
    };
   
    init();
};