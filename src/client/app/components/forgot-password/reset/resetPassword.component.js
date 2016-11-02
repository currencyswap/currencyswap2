'use strict';

angular.module('resetPassword')
    .component('resetPassword', {
        templateUrl: 'app/components/forgot-password/reset/resetPassword.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            function resetPassword($scope, $rootScope, $location, $http) {
                $scope.title = appConfig.title;
                $scope.isSubmitCodeForm = true;
                $scope.isNewPwdForm = false;
                $scope.resetCodeFormData = {};
                $scope.newPwdFormData = {};

                $scope.submitResetCode = function () {

                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    var postData = {
                        resetCode: $scope.resetCodeFormData.code,
                        email: $scope.resetCodeFormData.email
                    };

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD_RESET,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {
                            $scope.isSubmitCodeForm = false;
                            $scope.isNewPwdForm = true;
                        }, function (error) {
                            
                        });
                };

                $scope.submitNewPassword = function () {

                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    var postData = {
                        password: $scope.newPwdFormData.Password,
                        email: $scope.resetCodeFormData.email
                    };

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD_RESET,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {

                        }, function (error) {

                        });
                }
            }]
    });