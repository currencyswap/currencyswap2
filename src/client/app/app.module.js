'use strict';

angular.module('currencySwapApp', [
    'loginForm',
    'ngRoute',
    'ngCookies',
    'appHeader'
]).constant('ERRORS', {
}).run(function ($rootScope, $cookies, $location) {

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
    APP_TITLE: appConfig.title
});
