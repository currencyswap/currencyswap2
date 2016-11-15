'use strict';

angular.module('appHeader').directive('leftPanel', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        templateUrl: 'app/shared/header/left-panel.template.html',
        controller: function ($rootScope, $window, $location,$scope, $element ,CookieService) {
            var currUser = CookieService.getCurrentUser();
            $scope.currUser = {
                username: currUser.username,
                fullName: currUser.fullName,
                avatarUrl: currUser.avatarUrl ? currUser.avatarUrl : global.DEF_AVATAR
            };
            $scope.title = appConfig.title;
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
