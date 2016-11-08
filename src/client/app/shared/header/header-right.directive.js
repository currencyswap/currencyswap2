'use strict';

angular.module('appHeader').directive('headerRight', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        templateUrl: 'app/shared/header/header-right.template.html',
        controller: function ($rootScope, $window, $location, $scope, $element, CookieService) {

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

            $scope.onLogout = function () {
                $rootScope.loggedIn = false;
                $rootScope.isLoading = true;
                CookieService.cleanUpCookies();
                $location.path(routes.LOGIN);
                $window.location.reload();
            };
        }
    };
});
