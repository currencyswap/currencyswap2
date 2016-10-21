'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            'CookieService',
            'LoginService',
            'PermissionService',
            function loginController($scope, $rootScope, $location, CookieService, LoginService, PermissionService) {
                $scope.title = appConfig.title;
                $scope.errors = [];

                var token = CookieService.getToken();

                if (token) return $location.path(routes.HOME);

                $scope.onSubmit = function () {

                    LoginService.authenticate($scope.user)
                        .then(function (response) {
                            var newToken = response.data.token;
                            CookieService.setUpCookies(newToken);

                            PermissionService.getCurrentPermission(newToken).then(
                                function (response) {
                                    $rootScope.permissions = response.data;
                                    $rootScope.loggedIn = true;
                                    $location.path(routes.HOME);                                    
                                },
                                function (error) {
                                    CookieService.cleanUpCookies();
                                }
                            );

                        }, function (error) {
                            if (error.data) $scope.loginErrMsg = error.data.message;
                        })
                };
            }]
    });
