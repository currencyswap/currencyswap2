'use strict';
/**
 * @author Viet Nghiem
 */
angular.module('notification')
    .component('notification', {
        templateUrl: 'app/components/notification/notification.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            '$location',
            'CookieService',
            'NotiService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function notiController($scope, $rootScope, $timeout, $location, CookieService, NotiService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                $scope.messages = [];
                $scope.init = function() {
                    NotiService.getMessages().then(function(resp){
                        $timeout(function(){
                            $scope.messages = resp.messages;
                        });
                    });
                };
                
                $scope.readMessage = function(msg) {
                    NotiService.markRead(msg.id);
                    msg.reads.push({'created': new Date()});
                    if (msg.orderCode) {
                        $timeout(function(){
                            $location.path( routes.ORDERS + msg.orderCode );
                        });
                    } else {
                        $rootScope.openMessageModel(msg);
                    }
                  };
                  
                $scope.init();
            }]
    });
