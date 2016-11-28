/**
 * Created by thapnd on 11/28/2016.
 */
'use strict';

angular.module('userList').
    component('userInfo', {
        templateUrl: 'app/components/userInfo/userInfo.template.html',
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
            function userInfoController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
                console.log('userInfoController');
                debugger;
            }]
    });
