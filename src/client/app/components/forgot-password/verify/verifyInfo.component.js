'use strict';

angular.module('verifyInfo')
    .component('verifyInfo', {
        templateUrl: 'app/components/forgot-password/verify/verifyInfo.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            '$window',
            function verifyInfoController($scope, $rootScope, $location, $http, $window) {
                $scope.title = appConfig.title;
                $scope.isSubmitEmailForm = true;
                $scope.gifLoading = false;
                $scope.verification = {};

                $scope.backToLogin = function () {
                    $location.url(routes.LOGIN);
                };

                $scope.submitEmail = function () {
                    $scope.gifLoading = true;
                    $scope.invalid = false;
                    var headers = {};
                    var postData = {
                        email: $scope.verification.submittedEmail
                    };

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD_VERIFY,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {
                            $scope.gifLoading = false;
                            $scope.isSubmitEmailForm = false;
                            $scope.isSubmitSuccess = true;
                            $window.scrollTo(0, 0);
                        }, function (error) {
                            $scope.gifLoading = false;
                        });
                }
            }]
    });