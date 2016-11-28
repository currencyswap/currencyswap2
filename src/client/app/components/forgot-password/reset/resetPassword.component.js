'use strict';

angular.module('resetPassword')
    .component('resetPassword', {
        templateUrl: 'app/components/forgot-password/reset/resetPassword.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function resetPassword($scope, $rootScope, $location, $http, $window, GLOBAL_CONSTANT) {
                $scope.title = appConfig.title;
                $scope.newPwdFormData = {};

                $scope.isResetSuccess = false;

                $scope.backToLogin = function () {
                    $location.url(routes.LOGIN);
                };

                $scope.submitNewPassword = function () {

                    console.log('submitNewPassword action !!!');

                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    var postData = {
                        newPassword: $scope.newPwdFormData.password,
                        resetCode: resetCode
                    };

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD_RESET,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                $scope.isResetSuccess = true;
                                $scope.resetPwdForm = false;
                            } else {
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.UNKNOWN_ERROR_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.UNKNOWN_ERROR_MSG;
                                $window.scrollTo(0, 0);
                            }
                        }, function (error) {
                            $rootScope.error = {};
                            $rootScope.error.status = GLOBAL_CONSTANT.UNKNOWN_ERROR_STATUS;
                            $rootScope.error.message = GLOBAL_CONSTANT.UNKNOWN_ERROR_MSG;
                            $window.scrollTo(0, 0);
                        });
                };

                if ($location.search().resetCode) {
                    var resetCode = $location.search().resetCode;
                    CookieService.cleanUpCookies();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;

                    var req = {
                        method: httpMethods.GET,
                        url: apiRoutes.API_FORGOT_PASSWORD_RESET + '/' + '?resetCode=' + resetCode,
                        headers: headers
                    };

                    return $http(req)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                $scope.resetPwdForm = true;
                            } else {
                                if (response.data.code === serverErrors.RESET_PWD_CODE_NOT_FOUND) {
                                    $rootScope.error = {};
                                    $rootScope.error.status = GLOBAL_CONSTANT.UNKNOWN_ERROR_STATUS;
                                    $rootScope.error.message = GLOBAL_CONSTANT.UNKNOWN_ERROR_MSG;
                                    $window.scrollTo(0, 0);
                                }

                            }
                        }, function (error) {
                            $rootScope.error = {};
                            $rootScope.error.status = GLOBAL_CONSTANT.UNKNOWN_ERROR_STATUS;
                            $rootScope.error.message = GLOBAL_CONSTANT.UNKNOWN_ERROR_MSG;
                            $window.scrollTo(0, 0);
                        });
                }
            }]
    });