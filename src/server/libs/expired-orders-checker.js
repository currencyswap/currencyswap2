'use strict';
/**
 * @author Viet Nghiem
 */
var CronJob = require('cron').CronJob;

module.exports = function() {
    var performCheck = function() {
        console.log('CronJob expired-orders-checker::performCheck is starting...', new Date());
    };
    
    var init = function() {
        console.log('CronJob expired-orders-checker::init', new Date());
        var startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+10);
        var jobOnce = new CronJob(startTime, function() {
                performCheck();
                jobOnce.stop();
          }, function () {
              jobInterval.start();
              console.log('CronJob expired-orders-checker:: is completed', new Date());
          }, true);
        var jobInterval = new CronJob('* 15 * * * *', function() {
            performCheck();
          }, function () {
              console.log('CronJob expired-orders-checker:: is completed', new Date());
          }
        );
    };
    
    init();
};