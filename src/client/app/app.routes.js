'use strict';

angular.module('currencySwapApp').config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.when(routes.LOGIN, {
            template: '<login-form></login-form>'
        }).when(routes.FORGOT_PASSWORD_VERIFY, {
            template: '<verify-info></verify-info>'
        }).when(routes.FORGOT_PASSWORD_RESET, {
            template: '<reset-password></reset-password>'
        }).when(routes.REGISTER, {
            template: '<register></register>'
        }).otherwise('');
    }
]);
