'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope',
            '$rootScope',
            '$http',            
            '$location',
            '$cookies',
            'ERROR_MSG',
            'LoginService', 
            'PermissionService', 
            function loginController($scope, $rootScope, $http, $location, $cookies, ERROR_MSG, LoginService, PermissionService) {
                $scope.title = appConfig.title;
                $scope.errors = [];

                checkAuthentication($cookies, function (token) {
                    if (token) return $location.path(routes.HOME);
                });

                $scope.onSubmit = function () {

                    LoginService.authenticate($scope.user)
                        .then(function (response) {
                            var options = {
                                expires: new Date(Date.now() + parseInt(appConfig.cookieExpried))
                            };

                            var token = response.data.token;
                            var obj = getInfoFormToken(token);
                            
                            $cookies.put(global.TOKEN, token, options);
                            $cookies.put(global.CURRENT_USER, JSON.stringify({
                                username: obj.username,
                                fullName: obj.fullName
                            }), options);

                            PermissionService.getCurrentPermission( token ).then(
                                function ( response) {
                                    $rootScope.permissions = response.data;
                                    $location.path(routes.HOME);
                                    $rootScope.loggedIn = true;                                 
                                },
                                function ( error ) {
                                    $cookies.remove(global.TOKEN);
                                    $cookies.remove(global.CURRENT_USER);
                                }
                            );

                        }, function (error) {
                            if (error.data) $scope.loginErrMsg = error.data.message;
                        })
                };
            }]
    });
