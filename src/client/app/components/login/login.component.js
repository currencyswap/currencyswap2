'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope', '$rootScope', '$http', 'LoginService', '$location', '$cookies', 'ERROR_MSG', function loginController($scope, $rootScope, $http, LoginService, $location, $cookies, ERROR_MSG) {
            $scope.title = appConfig.title;
            $scope.errors = [];

            $scope.onSubmit = function () {

                LoginService.authenticate($scope.user)
                    .then(function (response) {
                        $location.path(routes.HOME);
                        $cookies.put(global.TOKEN, response.data.token);
                        $rootScope.loggedIn = true;
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
