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
                $scope.showPopover = function () {
                    $('[data-toggle="popover"]').popover();
                };
                if ($location.search().activeCode) {
                    $scope.startRegister = false;
                    $scope.registerSuccess = false;
                    var activeCode = $location.search().activeCode;
                    RegisterService.sendActiveRequest(activeCode)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) { // handle error response
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            } else {
                                $rootScope.isLoading = false;
                                $scope.registerSuccess = false;
                                $scope.startRegister = false;
                                $scope.activeSuccess = true;
                            }
                        });
                }
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
                $scope.altInputFormats = ['M!/d!/yyyy'];
                $scope.user = {};
                $scope.registerSuccess = false;
                $scope.startRegister = true;
                $scope.activeSuccess = false;
                $scope.gifLoading = false;
                $scope.userExisted = false;
                $scope.emailExisted = false;
                $scope.passportExisted = false;
                $scope.cellphoneExisted = false;
                $scope.calendar = { opened: false };
                $scope.openCalendar = function () {
                    $scope.calendar.opened = true;
                };
                $scope.onUsernameChange = function () {
                    $scope.userExisted = false;
                    $scope.emailExisted = false;
                };

                $scope.onEmailChange = function () {
                    $scope.userExisted = false;
                    $scope.emailExisted = false;
                };

                $scope.onSubmit = function () {
                    $scope.gifLoading = true;
                    var newUser = RegisterService.compressUserDataToObj($scope.user);
                    RegisterService.submitRequest(newUser)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) { //handle success response
                                $scope.gifLoading = false;
                                $scope.registerSuccess = true;
                                $scope.startRegister = false;
                                $window.scrollTo(0, 0);
                            } else { //handle error response
                                if (response.data.code === serverErrors.TRANSACTION_INIT_FAIL
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_ADDR_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_GR_TO_DB
                                    || response.data.code === serverErrors.ERROR_TX_ROLLBACK
                                    || response.data.code === serverErrors.ERROR_TX_COMMIT
                                    || response.data.code === serverErrors.ERR_COULD_NOT_SEND_MAIL) {

                                    $rootScope.error = {};
                                    $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                    $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                    $window.scrollTo(0, 0);
                                }

                                if (response.data.code === serverErrors.USER_NAME_EXISTED) {
                                    $scope.userExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusUsername = true;
                                }

                                if (response.data.code === serverErrors.EMAIL_EXISTED) {
                                    $scope.emailExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusEmail = true;
                                }

                                if (response.data.code === serverErrors.NATIONAL_ID_EXISTED) {
                                    console.log('11111');
                                    $scope.nationalIdExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusNationalId = true;
                                }

                                if (response.data.code === serverErrors.CELLPHONE_EXISTED) {
                                    console.log('22222');
                                    $scope.cellphoneExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusCellphone = true;
                                }
                            }
                        }, function (error) {
                            console.log("error",error);
                        });
                }
            }]
    });
