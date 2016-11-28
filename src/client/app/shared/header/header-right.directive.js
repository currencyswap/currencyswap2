'use strict';

angular.module('appHeader').directive('headerRight', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        templateUrl: 'app/shared/header/header-right.template.html',
        controller: function ($rootScope, $window, $location, $scope, $element, $timeout, CookieService, NotiService) {

            $scope.user = {
                permissions: $rootScope.permissions
            };

            // Init Menu Item
            $scope.toolbarItems = $rootScope.toolsBar;

            var cookUser = CookieService.getCurrentUser();
            $scope.user = $.extend({'avatarUrl': global.DEF_AVATAR, 'username': '', 'fullName': ''}, cookUser, $rootScope.user);

            $scope.onMyProfile = function () {
                $rootScope.isLoading = false;
                $location.path(routes.MYPROFILE);
            };

            $scope.onLogout = function () {
                $rootScope.loggedIn = false;
                $rootScope.isLoading = true;
                CookieService.cleanUpCookies();
                $location.path(routes.LOGIN);
                $window.location.reload();
            };

            $scope.solidClazName = function(item) {
              return item.name.toLowerCase().replace(/[\s]+/, '-');
            };
          $scope.readMessage = function(msg) {
              $.publish('/read/headMessage', [{'id': msg.id, 'isRead': msg.reads.length}]);
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
          
          var getNotiInst = function(){
              var notiObj = null;
              for (var i=0; i<$scope.toolbarItems.length; i++) {
                  if ($scope.toolbarItems[i].name === 'Notification') {
                      notiObj = $scope.toolbarItems[i];
                      break;
                  }
              }
              if (!notiObj) {
                  console.log('No notification attachpoint found!');
                  return;
              }
              return notiObj;
          }
          
          $scope.updateNotification = function() {
              var notiObj = getNotiInst();
              NotiService.getQuickMessages().then(function(resp){
                  $timeout(function(){
                      notiObj.messages = resp.messages;
                      notiObj.badge = resp.unreads;
                  });
                  $rootScope.notiMessages = resp.messages;
              });
          };
          // get first list
          $scope.updateNotification();
          // update notification if have the new messages
          $.subscribe('/receive/supportUpdate', function(data) {
              $scope.updateNotification();
          });
          $.subscribe('/read/notiMessage', function(msg) {
              $scope.updateNotification();
          });
        }
    };
});
