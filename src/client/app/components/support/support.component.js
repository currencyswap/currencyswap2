'use strict';

angular.module('support')
    .component('support', {
        templateUrl: 'app/components/support/support.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'CookieService',
            'SupportService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function supportController($scope, $rootScope, $timeout, CookieService, SupportService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
            }]
    });
