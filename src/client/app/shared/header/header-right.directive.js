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

            var currUser = CookieService.getCurrentUser();

            $scope.currUser = {
                username: currUser.username,
                fullName: currUser.fullName,
                avatarUrl: currUser.avatarUrl ? currUser.avatarUrl : global.DEF_AVATAR
            };

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
          
          $scope.readMessage = function(msg) {
            console.log('read message', msg);
          };
          
          $scope.updateNotification = function() {
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
              NotiService.getMessages().then(function(resp){
                  $timeout(function(){
                      notiObj.messages = resp.messages;
                      notiObj.badge = 3;
                  });
                  $rootScope.notiMessages = resp.messages;
              });
          };
          // get first list
          $scope.updateNotification();
        }
    };
});
