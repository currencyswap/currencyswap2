'use strict';

angular.module('myProfile')
    .component('myProfile', {
        templateUrl: 'app/components/myProfile/myProfile.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$window',
            'CookieService',
            'LoginService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function myProfileController($scope, $rootScope, $location, $window, CookieService, LoginService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {

            }]
    });
