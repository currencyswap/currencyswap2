angular.module('rateManagement')
    .component('rateManagement', {
        templateUrl: 'app/components/rate-management/rateManagement.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'SupportService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function rateManagementController($scope, $rootScope, $timeout, SupportService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                // static data, remove later
                $scope.todayRates = {usDollarBuy: 123, usDollarSell: 456, euroBuy: 123, euroSell: 456, poundBuy: 123, poundSell: 456};
                var usDollarMedian = Math.round(($scope.todayRates.usDollarBuy + $scope.todayRates.usDollarSell)/2);
                var poundMedian = Math.round(($scope.todayRates.poundBuy + $scope.todayRates.poundSell)/2);
                var euroMedian = Math.round(($scope.todayRates.euroBuy + $scope.todayRates.euroSell)/2);

                $scope.todayRates.usDollarMedian = usDollarMedian;
                $scope.todayRates.poundMedian = poundMedian;
                $scope.todayRates.euroMedian = euroMedian;
            }]
    });
