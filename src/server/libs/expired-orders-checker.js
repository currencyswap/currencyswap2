'use strict';
/**
 * @author Viet Nghiem
 */
var CronJob = require('cron').CronJob;
var async = require('async');

var orderService = require('../services/order-service');
var supportService = require('../services/support-service');
var constant = require('../libs/constants/constants');
var config = require('../global-config');

module.exports = function Checker() {
    var _performInSeries = function(orders, handler, done) {
        async.eachSeries(orders, function iterator(order, next) {
            handler(order, next);
          }, done);
    };
    var checkExpiredOnes = function() {
        var time = new Date();
        console.log('CronJob Checker::checkExpiredOnes is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            if (orders.length === 0) {
                console.log('CronJob Checker::checkExpiredOnes No items found');
                return;
            }
            _performInSeries(orders, function handler(order, next) {
                orderService.updateOrderStatus(order.id, constant.STATUS_TYPE.EXPIRED_ID).then(function(resp){
                    return next();
                }, function(e){
                    return next();
                });
            }, function done(){
                console.log('CronJob Checker::checkExpiredOnes Completed');
            });
        }, function(e){
            console.log('CronJob Checker::checkExpiredOnes Error', e);
        });
    };
    
    var notifyUser = function() {
        var time = new Date();
        time.setDate(time.getDate()+config.notifyOrderExpireBeforeDays);

        console.log('CronJob Checker::notifyUser is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            if (orders.length === 0) {
                console.log('CronJob Checker::notifyUser No items found');
                return;
            }
            supportService.getCreator((config.superUsername || 'admin')).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                _performInSeries(orders, function handler(order, next) {
                    _createNotiMessage(order, adminId, next);
                }, function done(){
                    console.log('CronJob Checker::notifyUser Completed');
                });
            }, function(e){
                console.log('CronJob Checker::notifyUser Error', e);
            });
        }, function(e){
            console.log('CronJob Checker::notifyUser Error', e);
        });
    };

    var _createNotiMessage = function(order, adminId, next) {
        order = order.toJSON();
        var ownerId = order.owner.id;
        var title = constant.MSG.ORDER_EXPIRE_SOON_TITLE;
        var msg = 'Order: ' + order.code + ', give: ' + order.give + ' ' + order.giveCurrency.code+ '-' + order.giveCurrency.name
                + ', get: ' + order.get + ' ' + order.getCurrency.code+ '-' + order.getCurrency.name +', rate: ' + order.rate 
                    + ', Created: ' + (order.created.toString()) + ', Expired: ' + (order.expired.toString());

        supportService.existExpiredOrderMessage(ownerId, title, msg).then(function(msgInst){
            if (msgInst && msgInst.id) {
                console.log('Message is already sent', ownerId, msg);
                return next();
            } else {
              supportService.saveMessage({'title': title, 
              'message': msg, 
              'creatorId': adminId, 'receiverId': ownerId}).then(function(resp){
                  return next();
              }, function(e){
                  return next();
              });//, 'orderCode': order.code
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
            checkExpiredOnes();
            notifyUser();
            jobOnce.stop();
          }, function () {
              jobEveryHourAtXXMins.start();
              console.log('CronJob Checker::jobEveryHourAtXXMins is completed', new Date());
          }, true);
        var jobEveryHourAtXXMins = new CronJob((config.scheduleCheckOrderExpired||'00 00,10,20,30,40,50 * * * *'), function() {
            checkExpiredOnes();
          }, function () {
              console.log('CronJob Checker::jobEveryHourAtXXMins is completed', new Date());
          }
        );
    };
    
    init();
};