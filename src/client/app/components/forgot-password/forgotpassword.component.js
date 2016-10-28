'use strict';

angular.module('forgotPassword')
    .component('forgotPassword', {
        templateUrl: 'app/components/forgot-password/forgotpassword.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            function forgotPasswordController($scope, $rootScope, $location, $http) {
                $scope.title = appConfig.title;
                var headers = {};
                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;

                $scope.submitEmail = function () {
                    var postData = {
                        email: $scope.registeredEmail
                    };
                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD,
                        headers: headers,
                        data: postData
                    };

                    $http(req)
                        .then(function (response) {
                            if (response.data) {
                                console.log(response.data);
                            }
                        }, function (error) {
                            if (error.data) {
                                $scope.isEmailNotFound = true;
                            }
                        });
                };

                $scope.onTextBoxChange = function () {
                    $scope.isEmailNotFound = false;
                }
            }]
    });