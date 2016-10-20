'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope', '$http', 'LoginService', '$location', 'GLOBAL_CONSTANT', function loginController($scope, $http, LoginService, $location, GLOBAL_CONSTANT) {
            $scope.title = GLOBAL_CONSTANT.APP_TITLE;

            $scope.onSubmit = function () {
                LoginService.authenticate($scope.user)
                    .then(function (response) {
                        $location.path(routes.HOME);
                    }, function (error) {
                        if (error.message === GLOBAL_CONSTANT.EMPTY_UNAME_OR_PWD_MSG) {
                            $scope.isEmptyField = true;
                        } else {
                            if (error.data.code === GLOBAL_CONSTANT.USERNAME_INVALID_CODE) {
                                $scope.invalidUsername = true;
                            }

                            if (error.data.code === GLOBAL_CONSTANT.PASSWORD_INVALID_CODE) {
                                $scope.invalidPassword = true;
                            }
                        }
                    });
                $scope.invalidUsername = null;
                $scope.invalidPassword = null;
                $scope.isEmptyField = null;
                $scope.user = null;
            };
        }]
    });
