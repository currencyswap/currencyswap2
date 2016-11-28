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
        }).when(routes.USERS, {
            template: '<user-list></user-list>'
        }).when(routes.USER, {
            template: '<user-detail></user-detail>'
        }).when(routes.MYPROFILE, {
            template: '<my-profile></my-profile>'
        }).when(routes.ORDERS, {
            template: '<orders></orders>'
        }).when(routes.ORDER_CREATE, {
            template: '<order-create></order-create>'
        }).when(routes.ORDER_DETAIL, {
            template: '<order-detail></order-detail>'
        }).when(routes.SUPPORT, {
            template: '<support></support>'
        }).when(routes.HELP, {
            template: '<help></help>'
        }).when(routes.NOTIFICATIONS, {
            template: '<notification></notification>'
        }).otherwise('');
    }
]);
