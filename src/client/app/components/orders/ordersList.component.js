'use strict';

angular.module('orders')
    .component('ordersList', {
        templateUrl: 'app/components/usersDetail/ordersList.template.html',
        controller: ['$scope',
            '$rootScope',
            'OrdersService',
            'CookieService',
            'PermissionService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            '$log',
            function userListController($scope, $rootScope, UserListService, OrdersService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {

            }]
    });
