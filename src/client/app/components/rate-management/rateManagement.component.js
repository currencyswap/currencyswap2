angular.module('rateManagement')
    .component('rateManagement', {
        templateUrl: 'app/components/rate-management/rate-management.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'SupportService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function rateManagementController($scope, $rootScope, $timeout, SupportService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                console.log('123456=======');
            }]
    });
