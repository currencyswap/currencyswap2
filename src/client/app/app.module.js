'use strict';

angular.module('currencySwapApp', [
    'loginForm',
    'ngRoute',
    'ngCookies',
    'appHeader'
]).run(function ($rootScope, $cookies, $location) {

    $rootScope.loggedIn = true;

    var token = $cookies.get(global.TOKEN);

    if (!token) {
        $rootScope.loggedIn = false;
        $location.path(routes.LOGIN);
    } else if ( $location.path() == routes.LOGIN ) {
        $location.path(routes.HOME);        
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
    }).constant('ERROR_MSG', {
        INVALID_USR_OR_PWD_MSG: 'Invalid username or password !',
        EMPTY_USR_OR_PWD_MSG: 'Empty username or password !'
    });
