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
                $scope.newPwdFormData = {};
                var resetCode = $location.search().resetCode;
                $scope.isResetSuccess = false;

                $scope.submitNewPassword = function () {

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
                            $scope.isResetSuccess = true;
                        }, function (error) {
                            console.log(error.data);
                        });
                }
            }]
    });