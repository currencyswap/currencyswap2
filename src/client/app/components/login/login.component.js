'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope', '$http', 'LoginService', '$location', 'GLOBAL_CONSTANT', function loginController($scope, $http, LoginService, $location, GLOBAL_CONSTANT) {
            $scope.title = GLOBAL_CONSTANT.APP_TITLE;
            $scope.errors = [];

            $scope.onSubmit = function () {

                LoginService.authenticate($scope.user)
                    .then(function (response) {
                        $location.path(routes.HOME);
                    }, function (error) {
                        if (!error.data) {
                            return $scope.errors.push(error.message);
                        }
                        return $scope.errors.push(error.data.message);
                    });
            };
        }]
    });
