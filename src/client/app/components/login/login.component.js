'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$window',
            'CookieService',
            'LoginService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function loginController($scope, $rootScope, $location, $window, CookieService, LoginService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                $scope.title = appConfig.title;
                $scope.errors = [];
                $scope.isExpired = false;
                var token = CookieService.getToken();

                if (token) return $location.path(routes.HOME);

                $scope.onSubmit = function () {

                    LoginService.authenticate($scope.user)
                        .then(function (response) {
                            if (response.data.expire === "expired") {
                                $scope.isExpired = true;
                            } else {
                                if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                    var newToken = response.data.token;
                                    CookieService.setUpCookies(newToken);

                                    PermissionService.getCurrentPermission(newToken)
                                        .then(function (response) {
                                                $rootScope.permissions = response.data;
                                                $rootScope.loggedIn = true;
                                                NavigationHelper.initNavigationBar();
                                                if ($rootScope.permissions && $rootScope.permissions.USER_MANAGEMENT) {
                                                    $location.path(routes.USERS);
                                                } else {
                                                    $location.path(routes.HOME);
                                                }
                                            },
                                            function (error) {
                                                CookieService.cleanUpCookies();
                                            }
                                        );
                                } else {
                                    if (response.data.code === serverErrors.INVALID_HTTP_HEADER
                                        || response.data.code === serverErrors.INVALID_AUTHORIZATION_HEADER
                                        || response.data.code === serverErrors.REDIS_SERVER_GET_PROBLEM
                                        || response.data.code === serverErrors.MISSING_REDIS_KEY
                                        || response.data.code === serverErrors.INVALID_TOKEN_API_KEY) {

                                        $rootScope.error = {};
                                        $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                        $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                        $window.scrollTo(0, 0);
                                    } else {
                                        if (response.data.code === serverErrors.MEMBER_INVALID_PASSWORD
                                            || response.data.code === serverErrors.MEMBER_INVALID_USERNAME) {
                                            $scope.loginErrMsg = GLOBAL_CONSTANT.INVALID_USER_NAME_OR_PWD_MSG;
                                        }

                                        if (response.data.code === serverErrors.ACCOUNT_IS_NOT_ACTIVATED) {
                                            $scope.loginErrMsg = GLOBAL_CONSTANT.ACCOUNT_IS_NOT_ACTIVATED_MSG;
                                        }
                                    }
                                }
                            }
                        })
                };

                $scope.onForgotPassword = function () {
                    $location.path(routes.FORGOT_PASSWORD_VERIFY);
                };

                $scope.onRegister = function () {
                    $location.path(routes.REGISTER);
                }
            }]
    });
