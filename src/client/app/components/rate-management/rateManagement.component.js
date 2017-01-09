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

                $scope.saveAndSendRateToUsers = function (rate) {
                    delete rate.id;
                    $scope.gifLoading = true;
                    RateManagementService.saveAndSendRateToUsers(rate)
                        .then(function (response) {
                            $scope.$apply(function () {
                                $scope.gifLoading = false;
                            })
                        }, function (err) {
                            console.log('err from server: ', err);
                        })
                };

                $scope.changeDollarBuy = function (editedDollarBuyValue) {
                    $scope.todayRates.usDollarMedian =  RateManagementService.recalculateMedian(editedDollarBuyValue, $scope.todayRates.usDollarSell);
                };

                $scope.changeDollarSell = function (editedSellValue) {
                    $scope.todayRates.usDollarMedian =  RateManagementService.recalculateMedian(editedSellValue, $scope.todayRates.usDollarBuy);
                };

                $scope.changePoundBuy = function (editedPoundBuyValue) {
                    $scope.todayRates.poundMedian =  RateManagementService.recalculateMedian(editedPoundBuyValue, $scope.todayRates.poundSell);
                };

                $scope.changePoundSell = function (editedPoundSellValue) {
                    $scope.todayRates.poundMedian =  RateManagementService.recalculateMedian(editedPoundSellValue, $scope.todayRates.poundBuy);
                };

                $scope.changeEuroBuy = function (editedEuroBuyValue) {
                    $scope.todayRates.euroMedian =  RateManagementService.recalculateMedian(editedEuroBuyValue, $scope.todayRates.euroSell);
                };

                $scope.changeEuroSell = function (editedEuroSellValue) {
                    $scope.todayRates.euroMedian =  RateManagementService.recalculateMedian(editedEuroSellValue, $scope.todayRates.euroBuy);
                };

                RateManagementService.getLatestExchangeRate()
                    .then(function (response) {
                        console.log('response from server: ', response);
                        $scope.todayRates = response;
                        backupData = angular.copy(response);
                        $scope.$apply();
                    }, function (error) {
                        console.log('error from server: ', error);
                    })
            }]
    });
