'use strict';

angular.module('notification')
    .component('notification', {
        templateUrl: 'app/components/notification/notification.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'CookieService',
            'NotiService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function notiController($scope, $rootScope, $timeout, CookieService, NotiService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
            }]
    });
