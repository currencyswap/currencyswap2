'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope', '$http', 'LoginService', '$location', 'ERROR_MSG', 'GLOBAL_CONSTANT', function loginController($scope, $http, LoginService, $location, ERROR_MSG, GLOBAL_CONSTANT) {
            $scope.title = appConfig.title;
            $scope.errors = [];

            $scope.onSubmit = function () {

                LoginService.authenticate($scope.user)
                    .then(function (response) {
                        $location.path(routes.HOME);
                    }, function (error) {
                        if (!error.data) {
                            $scope.loginErrMsg = ERROR_MSG.EMPTY_USR_OR_PWD_MSG;
                        } else {
                            $scope.loginErrMsg = ERROR_MSG.INVALID_USR_OR_PWD_MSG;
                        }
                    })
            };
        }]
    });
