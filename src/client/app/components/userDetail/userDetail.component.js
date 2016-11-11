'use strict';

angular.module('userDetail')
    .component('userDetail', {
        templateUrl: 'app/components/usersDetail/userDetail.template.html',
        controller: ['$scope',
            '$rootScope',
            'UserListService',
            'CookieService',
            'PermissionService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            '$log',
            function userListController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {

            }]
    });
