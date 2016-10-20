'use strict';

angular.module('currencySwapApp', [
    'loginForm',
    'ngRoute',
    'ngCookies',
    'appHeader'
]).run(function ($rootScope, $cookies, $location) {

    $rootScope.loggedIn = false;

    var token = $cookies.get(global.tokenKey);

    if (!token) {
        $rootScope.loggedIn = false;
        $location.path(routes.LOGIN);
    }
}).controller('CurrencySwapController', [
        '$rootScope',
        '$scope',
        function ($rootScope, $scope) {
            if ($rootScope.loggedIn) {
                $scope.loggedIn = true;
            }
        }
    ]
).constant('GLOBAL_CONSTANT', {
    APP_TITLE: 'Currency Swap',
    USERNAME_INVALID_CODE: 23,
    PASSWORD_INVALID_CODE: 24,
    EMPTY_UNAME_OR_PWD_MSG: 'Empty username or password'
});
