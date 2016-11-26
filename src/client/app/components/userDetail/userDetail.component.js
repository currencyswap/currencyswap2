'use strict';

angular.module('userDetail', [])
    .component('userDetail', {
        templateUrl: 'app/components/userDetail/userDetail.template.html',
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
            function userDetailController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
                $scope.isEditting = false;
                console.log("userDetailController")
                
            }]
    });
