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

                var actualUSDMedian;
                var actualPoundMedian;
                var actualEuroMedian;

                RateManagementService.getLatestExchangeRate()
                    .then(function (response) {
                        console.log('response from server: ', response);
                        $scope.todayRates = response;
                        backupData = angular.copy(response);
                        actualUSDMedian = $scope.todayRates.usDollarMedian;
                        actualPoundMedian = $scope.todayRates.poundMedian;
                        actualEuroMedian = $scope.todayRates.euroMedian;
                        $scope.$apply();
                    }, function (error) {
                        console.log('error from server: ', error);
                    });

                $scope.changeDollarBuy = function (editedDollarBuyValue) {
                    $scope.todayRates.usDollarMedian =  RateManagementService.recalculateMedian(editedDollarBuyValue, $scope.todayRates.usDollarSell);
                    $scope.todayRates.usdVariant = $scope.todayRates.usDollarMedian - actualUSDMedian;
                    $scope.todayRates.usdVariantAbs = Math.abs($scope.todayRates.usdVariant);

                };

                $scope.changeDollarSell = function (editedSellValue) {
                    $scope.todayRates.usDollarMedian =  RateManagementService.recalculateMedian(editedSellValue, $scope.todayRates.usDollarBuy);
                    $scope.todayRates.usdVariant = $scope.todayRates.usDollarMedian - actualUSDMedian;
                    $scope.todayRates.usdVariantAbs = Math.abs($scope.todayRates.usdVariant);
                };

                $scope.changePoundBuy = function (editedPoundBuyValue) {
                    $scope.todayRates.poundMedian =  RateManagementService.recalculateMedian(editedPoundBuyValue, $scope.todayRates.poundSell);
                    $scope.todayRates.poundVariant = $scope.todayRates.poundMedian - actualPoundMedian;
                    $scope.todayRates.poundVariantAbs = Math.abs($scope.todayRates.poundVariant);
                };

                $scope.changePoundSell = function (editedPoundSellValue) {
                    $scope.todayRates.poundMedian =  RateManagementService.recalculateMedian(editedPoundSellValue, $scope.todayRates.poundBuy);
                    $scope.todayRates.poundVariant = $scope.todayRates.poundMedian - actualPoundMedian;
                    $scope.todayRates.poundVariantAbs = Math.abs($scope.todayRates.poundVariant);
                };

                $scope.changeEuroBuy = function (editedEuroBuyValue) {
                    $scope.todayRates.euroMedian =  RateManagementService.recalculateMedian(editedEuroBuyValue, $scope.todayRates.euroSell);
                    $scope.todayRates.euroVariant = $scope.todayRates.euroMedian - actualEuroMedian;
                    $scope.todayRates.euroVariantAbs = Math.abs($scope.todayRates.euroVariant);
                };

                $scope.changeEuroSell = function (editedEuroSellValue) {
                    $scope.todayRates.euroMedian =  RateManagementService.recalculateMedian(editedEuroSellValue, $scope.todayRates.euroBuy);
                    $scope.todayRates.euroVariant = $scope.todayRates.euroMedian - actualEuroMedian;
                    $scope.todayRates.euroVariantAbs = Math.abs($scope.todayRates.euroVariant);
                };
            }]
    });
