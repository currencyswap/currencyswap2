'use strict';

angular.module('currencySwapApp', [
    'ngRoute',
    'ngCookies',
    'appHeader',
    'permission',
    'loginForm',
    'homePage',
]).run(function ($rootScope, $cookies, $location, $timeout, PermissionService) {

    checkAuthentication($cookies, function (token) {
        $rootScope.loggedIn = false;

        if (!token) {
            if ($location.path() != routes.LOGIN) return $location.path(routes.LOGIN);
            else return;
        }

        PermissionService.getCurrentPermission(token).then(
            function (response) {
                $rootScope.permissions = response.data;

                $rootScope.loggedIn = true;
                if ($location.path() == routes.LOGIN) return $location.path(routes.HOME);

            }, function (error) {
                let err = error.data;
                console.error('ERROR [%s] : %s.', err.code, err.message);

                if (err.code == serverErrors.INVALID_TOKEN_API_KEY ||
                    err.code == serverErrors.INVALID_TOKEN_API_KEY_FOR_USER) {
                    $cookies.remove(global.TOKEN);
                    $cookies.remove(global.CURRENT_USER);
                }
            }
        );
    });

}).controller('CurrencySwapController', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        if ($rootScope.loggedIn) {
            $scope.loggedIn = true;
        }
    }
]).constant('GLOBAL_CONSTANT', {

}).constant('ERROR_MSG', {
    INVALID_USR_OR_PWD_MSG: 'Invalid username or password !',
    EMPTY_USR_OR_PWD_MSG: 'Empty username or password !'
});
