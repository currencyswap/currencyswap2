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
var redis = require('./redis');

module.exports = function Checker(app) {
    var MsgExpiringOrderMap = {};
    var MsgExpiringUserMap = {};
    
    var _performInSeries = function(items, handler, done) {
        async.eachSeries(items, function iterator(item, next) {
            handler(item, next);
          }, done);
    };
    var setOrderExpired = function(next) {
        var time = new Date();
        console.log('JobChecker::setOrderExpired is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            if (orders.length === 0) {
                if (config.debug) console.log('JobChecker::setOrderExpired No items found');
                return next();
            } else {
                if (config.debug) console.log('JobChecker::setOrderExpired Found', orders.length);
            }
            _performInSeries(orders, function handler(order, next) {
                if (config.debug) console.log('JobChecker::setOrderExpired For', order.id, order.code, order.give, order.get, order.rate);
                orderService.updateOrderStatus(order.id, constant.STATUS_TYPE.EXPIRED_ID).then(function(resp){
                    return next();
                }, function(e){
                    return next();
                });
            }, function done(){
                if (config.debug) console.log('JobChecker::setOrderExpired Completed');
                return next();
            });
        }, function(e){
            console.log('JobChecker::setOrderExpired Error', e);
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

        console.log('JobChecker::nofityExpiringOrder is starting...', beforeExpTime);
        orderService.getExpiredOrders(beforeExpTime).then(function(orders){
            if (orders.length === 0) {
                if (config.debug) console.log('JobChecker::nofityExpiringOrder No items found');
                return;
            } else {
                if (config.debug) console.log('JobChecker::nofityExpiringOrder Found', orders.length);
            }
            supportService.getCreator((config.superUsername || 'admin')).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                if (config.debug) console.log('JobChecker::nofityExpiringOrder Admin:', adminUser.id, adminUser.username, adminUser.email);
                _performInSeries(orders, function handler(order, next) {
                    createExpOrderMessage(order, adminId, next);
                }, function done(){
                    if (config.debug) console.log('JobChecker::nofityExpiringOrder Completed');
                });
            }, function(e){
                console.log('JobChecker::nofityExpiringOrder Error', e);
            });
        }, function(e){
            console.log('JobChecker::nofityExpiringOrder Error', e);
        });
    };

    var createExpOrderMessage = function(order, adminId, next) {
        order = order.toJSON();
        if (MsgExpiringOrderMap[order.id]) {
            if (config.debug) console.log('Message is already sent', order.id, order.code);
            return;
        }
        var ownerId = order.owner.id;
        var title = constant.MSG.ORDER_EXPIRE_SOON_TITLE;
        var msg = 'Order: ' + order.code + ', Give: ' + order.give + ' ' + order.giveCurrency.code+ '-' + order.giveCurrency.name
                + ', Get: ' + order.get + ' ' + order.getCurrency.code+ '-' + order.getCurrency.name +', Rate: ' + order.rate 
                    + ', Created: ' + (order.created.toString()) + ', Expired: ' + (order.expired.toString());

        supportService.existMessage(ownerId, title, msg).then(function(msgInst){
            if (msgInst && msgInst.id) {
                if (config.debug) console.log('Message is already sent', ownerId, msg);
                MsgExpiringOrderMap[order.id] = true;
                return next();
            } else {
              supportService.saveMessage({'title': title, 
              'message': msg, 
              'creatorId': adminId, 'receiverId': ownerId}).then(function(resp){
                  if (config.debug) console.log('Message is sent', ownerId, msg);
                  MsgExpiringOrderMap[order.id] = true;
                  return next();
              }, function(e){
                  return next();
              });//, 'orderCode': order.code
            }
        });
    };
    
    var removeSessionOfExpiredUser = function(username) {
        redis.getUserInfo(username, function (err, user) {
            if (user && user.username) {
                console.log('User get expired', username, 'Expired Time:', user.expiredDate);
                redis.removeUserInfo(username);
                app.SocketMessage.sendUserExpired(user.id);
            }
        });
    };
    var setUserExpired = function(next) {
        var time = new Date();
        console.log('JobChecker::setUserExpired is starting...', time);
        userService.getExpiredUsers(time).then(function(users){
            if (users.length === 0) {
                if (config.debug) console.log('JobChecker::setUserExpired No items found');
                return next();
            } else {
                if (config.debug) console.log('JobChecker::setUserExpired Found', users.length);
            }
            _performInSeries(users, function handler(user, next) {
                removeSessionOfExpiredUser(user.username);
                userService.updateUserStatus(user.id, constant.USER_STATUSES.EXPIRED).then(function(resp){
                    if (config.debug) console.log('JobChecker::setUserExpired updateUserStatus', user.id, user.username, user.email);
                    return next();
                }, function(e){
                    return next();
                });
            }, function done(){
                if (config.debug) console.log('JobChecker::setUserExpired Completed');
                return next();
            });
        }, function(e){
            console.log('JobChecker::setUserExpired Error', e);
            return next();
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

        console.log('JobChecker::nofityExpiringUser is starting...', beforeExpTime, limitTime);
        userService.getExpiredUsers(beforeExpTime, limitTime).then(function(users){
            if (users.length === 0) {
                if (config.debug) console.log('JobChecker::nofityExpiringUser No items found');
                return;
            } else {
                if (config.debug) console.log('JobChecker::nofityExpiringUser Found', users.length);
            }
            supportService.getCreator((config.superUsername || 'admin')).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                if (config.debug) console.log('JobChecker::nofityExpiringUser Admin:', adminUser.id, adminUser.username, adminUser.email);
                _performInSeries(users, function handler(user, next) {
                    createExpUserMessage(user, adminId, next);
                }, function done(){
                    if (config.debug) console.log('JobChecker::nofityExpiringUser Completed');
                });
            }, function(e){
                console.log('JobChecker::nofityExpiringUser Error', e);
            });
        }, function(e){
            console.log('JobChecker::nofityExpiringUser Error', e);
        });
    };

    var createExpUserMessage = function(user, adminId, next) {
        user = user.toJSON();
        if (MsgExpiringUserMap[user.id]) {
            if (config.debug) console.log('Message is already sent', user.id, user.code);
            return;
        }
        var ownerId = user.id;
        var title = constant.MSG.USER_EXPIRE_SOON_TITLE;
        var msg = 'User name: ' + user.username + ', Full name: ' + user.fullName + ', Email: ' + user.email
                + ', Joint: ' + (user.registeredDate.toString()) + ', Expired: ' + (user.expiredDate.toString());

        supportService.existMessage(ownerId, title, msg).then(function(msgInst){
            if (msgInst && msgInst.id) {
                if (config.debug) console.log('Message is already sent', ownerId, msg);
                MsgExpiringUserMap[user.id] = true;
                return next();
            } else {
              supportService.saveMessage({'title': title, 
              'message': msg, 
              'creatorId': adminId, 'receiverId': ownerId}).then(function(resp){
                  if (config.debug) console.log('Message is sent', ownerId, msg);
                  MsgExpiringUserMap[user.id] = true;
                  return next();
              }, function(e){
                  return next();
              });
            }
        });
    };
    
    var init = function() {
        console.log('JobChecker::init', new Date());
        var delay = 10;
        var startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+delay);
        // run only 1 time at starting app
        var jobOnce = new CronJob(startTime, function() {
            setOrderExpired(nofityExpiringOrder);
            setUserExpired(nofityExpiringUser);
            jobOnce.stop();
          }, function () {
              jobEveryHourAtXXMins.start();
              console.log('JobChecker::jobEveryHourAtXXMins is completed', new Date());
          }, true);
        var jobEveryHourAtXXMins = new CronJob((config.scheduleCheckExpired||'00 00,10,20,30,40,50 * * * *'), function() {
            setOrderExpired(nofityExpiringOrder);
            setUserExpired(nofityExpiringUser);
          }, function () {
              console.log('JobChecker::jobEveryHourAtXXMins is completed', new Date());
          }
        );
    };
   
    init();
};