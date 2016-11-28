'use strict';

angular.module('register')
    .component('register', {
        templateUrl: 'app/components/register/register.template.html',
        controller: ['$scope',
            '$rootScope',
            'RegisterService',
            'CookieService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function registerController($scope, $rootScope, RegisterService, CookieService, $location, $http, $window, GLOBAL_CONSTANT) {
                $scope.showPopover = function () {
                    $('[data-toggle="popover"]').popover();
                };

                $scope.init = function() {
                    $scope.showPopover();
                };
                if ($location.search().activeCode) {
                    $scope.startRegister = false;
                    $scope.registerSuccess = false;

                    var activeCode = $location.search().activeCode;
                    RegisterService.sendActiveRequest(activeCode)
                        .then(function (response) {
                            $rootScope.isLoading = true;
                            if (response.status === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) { // handle error response
                                if (response.data.code === serverErrors.ACTIVE_ACC_CODE_NOT_FOUND) {
                                    $rootScope.isLoading = false;
                                    $rootScope.error = GLOBAL_CONSTANT.ACTIVE_CODE_EXPIRED_ERROR;

                                    return $location.url(routes.ERROR_PAGE);
                                }

                                if (response.data.code === serverErrors.COULD_NOT_DECRYPT_ACTIVE_ACC_CODE
                                || response.data.code === serverErrors.ACTIVE_ACC_CODE_DOES_NOT_MATCH
                                || response.data.code === serverErrors.NO_USER_FOUND_IN_DB) {

                                    $rootScope.isLoading = false;
                                    $rootScope.error = GLOBAL_CONSTANT.COULD_NOT_DECRYPT_ACTIVE_ACC_CODE_ERROR;

                                    return $location.url(routes.ERROR_PAGE);
                                }

                                if (response.data.code === serverErrors.SERVER_GOT_PROBLEM) {
                                    $rootScope.isLoading = false;
                                    $rootScope.error = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_ERROR;

                                    return $location.url(routes.ERROR_PAGE);
                                }


                            } else {
                                $rootScope.isLoading = false;
                                $scope.registerSuccess = false;
                                $scope.startRegister = false;
                                $scope.activeSuccess = true;
                            }
                        }, function (error) {
                            $rootScope.error = GLOBAL_CONSTANT.UNKNOWN_ERROR;
                            $window.scrollTo(0, 0);
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
                $scope.user.birthday = new Date();
                $scope.onSubmit = function () {
                    $scope.gifLoading = true;
                    var newUser = RegisterService.compressUserDataToObj($scope.user);
                    RegisterService.submitRequest(newUser)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) { //handle error response
                                if (response.data.code === serverErrors.TRANSACTION_INIT_FAIL
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_ADDR_TO_DB
                                    || response.data.code === serverErrors.COULD_NOT_SAVE_USER_GR_TO_DB
                                    || response.data.code === serverErrors.ERROR_TX_ROLLBACK
                                    || response.data.code === serverErrors.ERROR_TX_COMMIT
                                    || response.data.code === serverErrors.ERR_COULD_NOT_SEND_MAIL) {

                                    $rootScope.isLoading = false;
                                    $rootScope.error = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_ERROR;

                                    return $location.url(routes.ERROR_PAGE);
                                }

                                if (response.data.code === serverErrors.USERNAME_EXCEED_MAX_LENGTH
                                    || response.data.code === serverErrors.PASSWORD_EXCEED_MAX_LENGTH
                                    || response.data.code === serverErrors.EMAIL_EXCEED_MAX_LENGTH
                                    || response.data.code === serverErrors.REQUEST_NO_USERNAME
                                    || response.data.code === serverErrors.USERNAME_IS_NOT_STRING
                                    || response.data.code === serverErrors.REQUEST_NO_PASSWORD
                                    || response.data.code === serverErrors.PASSWORD_IS_NOT_STRING
                                    || response.data.code === serverErrors.EMAIL_IS_NOT_STRING
                                    || response.data.code === serverErrors.EMAIL_IS_INVALID
                                    || response.data.code === serverErrors.FULLNAME_IS_NOT_STRING
                                    || response.data.code === serverErrors.FULLNAME_EXCEED_MAX_LENGTH
                                    || response.data.code === serverErrors.CELLPHONE_EXCEED_MAX_LENGTH
                                    || response.data.code === serverErrors.PROFESSION_EXCEED_MAX_LENGTH) {

                                    $rootScope.isLoading = false;
                                    $rootScope.error = GLOBAL_CONSTANT.BAD_REQUEST_ERROR;

                                    return $location.url(routes.ERROR_PAGE);
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
                                    $scope.nationalIdExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusNationalId = true;
                                }

                                if (response.data.code === serverErrors.CELLPHONE_EXISTED) {
                                    $scope.cellphoneExisted = true;
                                    $scope.gifLoading = false;
                                    $scope.focusCellphone = true;
                                }
                            } else { //handle success response
                                $scope.gifLoading = false;
                                $scope.registerSuccess = true;
                                $scope.startRegister = false;
                                $window.scrollTo(0, 0);
                            }
                        }, function (error) {
                            $rootScope.error = GLOBAL_CONSTANT.UNKNOWN_ERROR;
                            $window.scrollTo(0, 0);
                        });
                };

                $scope.backToLogin = function () {
                    $location.url(routes.LOGIN);
                };
                
                // init
                $scope.init();
            }]
    });
