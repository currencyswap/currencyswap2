'use strict';

angular.module('appHeader').directive('leftPanel', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        templateUrl: 'app/shared/header/left-panel.template.html',
        controller: function ($rootScope, $scope, $window, $location, $timeout, $element ,CookieService) {
            var cookUser = CookieService.getCurrentUser();
            var avatarUrl = cookUser.avatarUrl ? cookUser.avatarUrl : global.DEF_AVATAR;
            $scope.user = $.extend({'avatarUrl': avatarUrl, 'username': cookUser.username, 'fullName': ''}, $rootScope.user);

            $scope.title = appConfig.title;
            $scope.onLogout = function () {
                $rootScope.loggedIn = false;
                $rootScope.isLoading = true;
                CookieService.cleanUpCookies();
                $location.path(routes.LOGIN);
                $window.location.reload();
            };
            
            $scope.accessMenuItem = function(item) {
                if ($('body').css('position') == 'relative') {
                    $rootScope.menuToggle();
                }
                $location.path(item.route);
            };

            $.subscribe('/cs/user/update', function(user) {
                $timeout(function(){
                    $scope.user = $.extend({'avatarUrl': avatarUrl, 'username': '', 'fullName': ''}, $scope.user, user);
                });
            });
        }
    };
});
