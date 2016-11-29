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
                    $.publish('/cs/read/notiMessage', [{'id': msg.id, 'isRead': msg.reads.length}]);
                    if (msg.reads.length === 0) {
                        NotiService.markRead(msg.id);
                        msg.reads.push({'created': new Date()});
                    }

                    if (msg.orderCode) {
                        $timeout(function(){
                            $location.path( routes.ORDERS + msg.orderCode );
                        });
                    } else {
                        $rootScope.openMessageModel(msg);
                    }
                  };
                
                  $.subscribe('/cs/read/headMessage', function(msg) {
                      for (var i=0; i<$scope.messages.length; i++) {
                          if ($scope.messages[i].id === msg.id) {
                              if ($scope.messages[i].reads.length === 0)
                              $timeout(function(){
                                  $scope.messages[i].reads.push({'created': new Date()});
                              });
                              break;
                          }
                      }
                  });
                $scope.init();
            }]
    });
