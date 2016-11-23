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
                $scope.messageTitle = 'Message to Admin';
                $scope.support = {title: '', message: ''};
                $scope.init = function() {
                    $('[data-toggle="popover"]').popover();
                };
                $scope.save = function() {
                    
                };

                // init
                $scope.init();
            }]
    });
