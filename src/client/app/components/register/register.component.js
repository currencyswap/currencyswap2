'use strict';

angular.module('register')
    .component('register', {
        templateUrl: 'app/components/register/register.template.html',
        controller: ['$scope',
            '$rootScope',
            'RegisterService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function registerController($scope, $rootScope, RegisterService, $location, $http, $window, GLOBAL_CONSTANT) {
                $scope.user = {};
                $scope.registerSuccess = false;
                $scope.gifLoading = false;
                $scope.userExisted = false;
                $scope.emailExisted = false;

                $scope.onSubmit = function () {
                    $scope.gifLoading = true;
                    var newUser = RegisterService.compressUserDataToObj($scope.user);

                    RegisterService.submitRequest(newUser)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) { //handle success response
                                $scope.gifLoading = false;
                                $scope.registerSuccess = true;
                                $window.scrollTo(0, 0);
                            } else { //handle error response
                                if (response.data.code === serverErrors.TRANSACTION_INIT_FAIL
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_ADDR_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_GR_TO_DB
                                    || response.data.code === serverErrors.ERROR_TX_ROLLBACK
                                    || response.data.code === serverErrors.ERROR_TX_COMMIT) {

                                    $rootScope.error = {};
                                    $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                    $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                    $window.scrollTo(0, 0);
                                }

                                if (response.data.code === serverErrors.USER_NAME_EXISTED) {
                                    $scope.gifLoading = false;
                                    $scope.userExisted = true;
                                    $scope.focusUsername = true;
                                }

                                if (response.data.code === serverErrors.EMAIL_EXISTED) {
                                    $scope.gifLoading = false;
                                    $scope.emailExisted = true;
                                    $scope.focusEmail = true;
                                }
                            }
                        }, function (error) {
                        });
                }
            }]
    });
