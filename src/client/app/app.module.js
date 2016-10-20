'use strict';

angular.module('currencySwapApp', [
    'loginForm',
    'ngRoute',
    'ngCookies',
    'appHeader'
]).run(function ($rootScope, $cookies, $location, Permission) {

    checkAuthentication($cookies, function (token) {
        $rootScope.loggedIn = true;

        if (!token) {
            $rootScope.loggedIn = false;
            if ($location.path() != routes.LOGIN) return $location.path(routes.LOGIN);
            else return;
        }

        Permission.getCurrentPermission( token ).then(
            function ( response ) {
                if (token && $location.path() == routes.LOGIN) {
                    return $location.path(routes.HOME);
                } else if (token) {
                    return;
                }
            }, function ( err ) {
                // 
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
}).factory('Permission', ['$http', '$q', function ($http, $q) {
    return {
        getCurrentPermission: function ( token ) {
            // 
        }
    }
}]);
