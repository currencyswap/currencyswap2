angular.module('rateManagement')
    .component('rateManagement', {
        templateUrl: 'app/components/rate-management/rateManagement.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'SupportService',
            'RateManagementService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function rateManagementController($scope, $rootScope, $timeout, SupportService, RateManagementService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                var backupData = {};
                $scope.undo = function () {
                    $scope.todayRates = angular.copy(backupData);
                };

                RateManagementService.getLatestExchangeRate()
                    .then(function (response) {
                        console.log('response from server: ', response);
                        $scope.todayRates = response;
                        backupData = angular.copy(response);
                    }, function (error) {
                        console.log('response from server: ', error);
                    })
            }]
    });
