'use strict';

angular.module('verifyInfo')
    .component('verifyInfo', {
        templateUrl: 'app/components/forgot-password/verify/verifyInfo.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            function verifyInfoController($scope, $rootScope, $location, $http) {
                $scope.title = appConfig.title;
                $scope.isSubmitEmailForm = true;
                $scope.verification = {};

                $scope.submitEmail = function () {
                    var headers = {};
                    var postData = {
                        email: $scope.verification.submittedEmail
                    };

                    console.log(postData);

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_FORGOT_PASSWORD_VERIFY,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {
                            $scope.isSubmitEmailForm = false;
                            $scope.isSubmitSuccess = true;
                        }, function (error) {
                            console.log(error);
                        });
                }
            }]
    });