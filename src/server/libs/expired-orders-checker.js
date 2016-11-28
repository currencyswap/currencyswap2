'use strict';
/**
 * @author Viet Nghiem
 */
var CronJob = require('cron').CronJob;

var orderService = require('../services/order-service');
var supportService = require('../services/support-service');
var constant = require('../libs/constants/constants');
var config = require('./app-config');

module.exports = function Checker() {
    var checkExpiredOnes = function() {
        var time = new Date();
        console.log('CronJob Checker::checkExpiredOnes is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            for (var i=0; i<orders.length; i++) {
                var order = orders[i];
                orderService.updateOrderStatus(order.id, constant.STATUS_TYPE.EXPIRED_ID);
            }
        }, function(e){
            console.log('CronJob Checker::checkExpiredOnes Error', e);
        });
    };
    
    var notifyUser = function() {
        var time = new Date();
        time.setSeconds(0);
        time.setMinutes(0);
        time.setHours(0);
        time.setDate(time.getDate()-1);

        console.log('CronJob Checker::notifyUser is starting...', time);
        orderService.getExpiredOrders(time).then(function(orders){
            if (orders.length === 0) {
                return;
            }
            supportService.getCreator(config.getSuperUsername()).then(function(adminUser){
                var adminId = (adminUser.id || 1);
                for (var i=0; i<orders.length; i++) {
                    var order = orders[i];
                    var msg = 'Order: ' + order.code + ', give: ' + order.give + ' ' + order.giveCurrency.code+ '-' + order.giveCurrency.name
                    + ', get: ' + order.get + ' ' + order.getCurrency.code+ '-' + order.getCurrency.name +', rate: ' + order.rate 
                    + ', Created: ' + (order.created.toString()) + ', Expired: ' + (order.expired.toString());

                    supportService.saveMessage({'title': constant.MSG.ORDER_EXPIRE_SOON_TITLE, 
                        'message': msg, 
                        'creatorId': adminId, 'receiverId': order.owner.id, 'orderCode': order.code});
                }
            }, function(e){
                console.log('CronJob Checker::notifyUser Error', e);
            });
        }, function(e){
            console.log('CronJob Checker::notifyUser Error', e);
        });
    };
    
    var init = function() {
        console.log('CronJob Checker::init', new Date());
        var startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+10);
        // run only 1 time at starting app
        var jobOnce = new CronJob(startTime, function() {
            checkExpiredOnes();
                jobOnce.stop();
          }, function () {
              jobEveryHourAtXXMins.start();
              jobEveryDayAtXXHours.start();
              console.log('CronJob Checker::checkExpiredOnes is completed', new Date());
          }, true);
        var jobEveryHourAtXXMins = new CronJob('00 00,10,20,30,40,50 * * * *', function() {
            checkExpiredOnes();
          }, function () {
              console.log('CronJob Checker::checkExpiredOnes is completed', new Date());
          }
        );
        var jobEveryDayAtXXHours = new CronJob('00 00 08 * * *', function() {
            notifyUser();
          }, function () {
              console.log('CronJob Checker::notifyUser is completed', new Date());
          }
        );
    };
    
    init();
};