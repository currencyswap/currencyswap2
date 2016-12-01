'use strict';

angular.module('appHeader').directive('headerRight', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        templateUrl: 'app/shared/header/header-right.template.html',
        controller: function ($rootScope, $scope, $window, $location, $element, $timeout, CookieService, NotiService) {
            var _fixAvatarUrl = function(avatarUrl) {
                var iA = avatarUrl.lastIndexOf('?');
                if (iA > 0) {
                    avatarUrl = avatarUrl.substring(0, iA+1);
                } else {
                    avatarUrl += '?';
                }
                avatarUrl += Math.round(Math.random()*10000000);
                return avatarUrl;
            };
            $scope.user = {
                permissions: $rootScope.permissions
            };

            // Init Menu Item
            $scope.toolbarItems = $rootScope.toolsBar;

            var cookUser = CookieService.getCurrentUser();
            var avatarUrl = _fixAvatarUrl(cookUser.avatarUrl ? cookUser.avatarUrl : global.DEF_AVATAR);
            $scope.user = $.extend({'avatarUrl': avatarUrl, 'username': cookUser.username, 'fullName': ''}, $rootScope.user);

            $scope.accessMenuItem = function(item) {
                $location.path(item.route);
                $rootScope.isLoading = false;
            };

            $rootScope.logout = $scope.onLogout = function () {
                $rootScope.loggedIn = false;
                $rootScope.isLoading = true;
                CookieService.cleanUpCookies();
                $location.path(routes.LOGIN);
                $window.location.reload();
            };

            $scope.solidClazName = function(item) {
              return item.id.toLowerCase().replace(/[\s]+/, '-');
            };
          $scope.readMessage = function(msg) {
              $.publish('/cs/read/headMessage', [{'id': msg.id, 'isRead': msg.reads.length}]);
              if (msg.reads.length === 0) {
                  NotiService.markRead(msg.id);
                  msg.reads.push({'created': new Date()});
                  var notiObj = getNotiInst();
                  if (notiObj.badge > 0) {
                      $timeout(function(){
                          --notiObj.badge;
                      });
                  }
              }

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
                  $.publish('/cs/update/notiMessage', [resp.messages]);
              });
          };
          // get first list
          $scope.updateNotification();
          // update notification if have the new messages
          $.subscribe('/receive/supportUpdate', function(data) {
              $scope.updateNotification();
          });
          $.subscribe('/receive/userExpired', function(data) {
              alert('Your account gets expired. Please contact Administrator for farther information!');
              $scope.onLogout();
          });
          $.subscribe('/cs/read/notiMessage', function(msg) {
              $scope.updateNotification();
          });
          $.subscribe('/cs/user/update', function(user) {
              var avatarUrl = _fixAvatarUrl(cookUser.avatarUrl ? cookUser.avatarUrl : global.DEF_AVATAR);
              $timeout(function(){
                  $scope.user = $.extend({'avatarUrl': avatarUrl, 'username': '', 'fullName': ''}, $scope.user, user);
              });
          });
        }
    };
});
