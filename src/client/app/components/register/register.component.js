'use strict';

angular.module('register')
    .component('register', {
        templateUrl: 'app/components/register/register.template.html',
        controller: ['$scope',
            '$rootScope',
            'RegisterService',
            '$location',
            '$http',
            function registerController($scope, $rootScope, RegisterService) {
                $scope.user = {};
                $scope.registerSuccess = false;

                $scope.onSubmit = function () {
                    var newUser = RegisterService.compressUserDataToObj($scope.user);

                    RegisterService.submitRequest(newUser)
                        .then(function (response) {
                            $scope.registerSuccess = true;
                        }, function (error) {
                            $rootScope.error = {};
                            $rootScope.error.status = 400;
                            $rootScope.error.message = error.data.message;
                        });
                }
            }]
    });
