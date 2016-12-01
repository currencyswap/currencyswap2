'use strict';

angular.module('myProfile')
    .component('myProfile', {
        templateUrl: 'app/components/myProfile/myProfile.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$window',
            '$timeout',
            '$http',
            'Upload',
            'CookieService',
            'LoginService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            'MyProfileService',
            function myProfileController($scope, $rootScope, $location, $window, $timeout, $http, Upload, CookieService, LoginService, PermissionService, NavigationHelper, GLOBAL_CONSTANT,MyProfileService) {
                $rootScope.loading = true;
                $scope.model = {};
                var currentUser = CookieService.getCurrentUser();
                $scope.randomNumImg = 0;
                $scope.message = "";
                $scope.formats = ['MMM dd,yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
                $scope.altInputFormats = ['M!/d!/yyyy'];
                $scope.GLOBAL_CONSTANT = GLOBAL_CONSTANT;
                var profilePicReq = {
                    method: httpMethods.GET,
                    url: '/config/' + currentUser.username
                };

                $http(profilePicReq)
                    .then(function (response) {
                        return;
                    });

                var token = CookieService.getToken();

                var headers = {};

                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;
                $scope.getUserInfo = function () {
                    MyProfileService.getUserInfo(headers).then(function(response){
                        var userDetail = response.data;
                        $scope.model.username = userDetail.username;
                        $scope.model.birthday = new Date(userDetail.birthday);
                        $scope.model.email = userDetail.email;
                        $scope.model.expiredDate = new Date(userDetail.expiredDate);
                        $scope.model.registeredDate = new Date(userDetail.registeredDate);
                        $scope.model.fullName = userDetail.fullName;
                        $scope.fullName = $scope.model.fullName;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('address')) $scope.model.address = userDetail.addresses[0].address;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('city')) $scope.model.city = userDetail.addresses[0].city;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('state')) $scope.model.state = userDetail.addresses[0].state;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('country')) $scope.model.country = userDetail.addresses[0].country;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('postcode')) $scope.model.postcode = userDetail.addresses[0].postcode;
                        $scope.model.cellphone = userDetail.cellphone;
                        $scope.model.nationalId = userDetail.nationalId;
                        $scope.model.profession = userDetail.profession;
                        $scope.model.bankAccountName = userDetail.bankAccountName;
                        $scope.model.bankAccountNumber = userDetail.bankAccountNumber;
                        $scope.model.bankName = userDetail.bankName;
                        $scope.model.bankCountry = userDetail.bankCountry;
                        $scope.$evalAsync();
                    }, function(err){
                        console.log('Failure in saving your message',err);
                    });
                };

                $scope.getUserInfo();
                $scope.uploadFiles = function(file, errFiles) {

                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];

                    if (file) {
                        file.upload = Upload.upload({
                            method: 'POST',
                            url: '/api/profile',
                            data: {
                                file: file
                            },
                            headers: headers
                        });

                        file.upload.then(function (response) {
                            $scope.randomNumImg = parseInt(Math.floor(Number.MAX_SAFE_INTEGER * Math.random()));
                            $timeout(function () {
                                file.result = response.data;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

                $scope.isEditting = false;
                $scope.calendarPicker = {
                    opened: false
                };

                $scope.birthday = new Date();
                $scope.openCalendar = function() {
                    if($scope.isEditting)$scope.calendarPicker.opened = true;
                };

                $scope.openCalendar1 = function() {
                    if($scope.isEditting)$scope.calendarPicker.opened1 = true;
                };

                $scope.changeStateToEdit = function () {
                    $scope.isEditting = true;
                };

                $scope.onDOBChange = function () {
                    $scope.greaterThanCurrentDate = false;
                };

                $scope.onChangeCurrentPwd = function () {
                    $scope.invalidPassword = false;
                };

                $scope.onNationalIdChange = function () {
                    $scope.errorNationalIdExisted = false;
                };

                $scope.onCellphoneChange = function () {
                    $scope.errorCellphoneExisted = false;
                };

                $scope.saveUserInfo = function () {
                    $scope.message = '';
                    $scope.gifLoading = true;

                    var updatingUser = {
                        username: $scope.model.username,
                        birthday: $scope.model.birthday,
                        email: $scope.model.email,
                        expiredDate: $scope.model.expiredDate,
                        fullName: $scope.model.fullName,
                        registeredDate: $scope.model.registeredDate,
                        bankAccountName: $scope.model.bankAccountName,
                        bankAccountNumber: $scope.model.bankAccountNumber,
                        bankName: $scope.model.bankName,
                        bankCountry: $scope.model.bankCountry,
                        addresses: [
                            {
                                address: $scope.model.address,
                                city: $scope.model.city,
                                state: $scope.model.state,
                                country: $scope.model.country,
                                postcode: $scope.model.postcode
                            }
                        ],
                        profession: $scope.model.profession,
                        cellphone: $scope.model.cellphone,
                        nationalId: $scope.model.nationalId,
                        currentPwd: $scope.model.currentPwd,
                    };

                    if ($scope.model.newPwd && $scope.model.passwordCompare) {
                        updatingUser.newPassword = $scope.model.newPwd;
                        updatingUser.passwordCompare = $scope.model.passwordCompare;
                    }

                    var headersSave = {};

                    headersSave[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headersSave[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    MyProfileService.saveUserInfo(updatingUser, headersSave)
                        .then(function (response) {
                            $scope.validation = {};
                            if (response.status === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) {
                                if (response.data.code === serverErrors.BIRTHDAY_GREATER_THAN_CURRENT_DATE) {
                                    $scope.gifLoading = false;
                                    $scope.greaterThanCurrentDate = true;
                                }

                                if (response.data.code === serverErrors.INVALID_PASSWORD) {
                                    $scope.gifLoading = false;
                                    $scope.invalidPassword = true;
                                }

                                if (response.data.code === serverErrors.NATIONAL_ID_EXISTED) {
                                    $scope.gifLoading = false;
                                    $scope.errorNationalIdExisted = true;
                                }

                                if (response.data.code === serverErrors.CELLPHONE_EXISTED) {
                                    $scope.gifLoading = false;
                                    $scope.errorCellphoneExisted = true;
                                }
                            } else {
                                $scope.getUserInfo();
                                $scope.gifLoading = false;
                                $scope.message = 'Successful: Your info has been updated';
                            }
                        }, function (err) {
                            $scope.gifLoading = false;
                            $rootScope.error = GLOBAL_CONSTANT.UNKNOWN_ERROR;
                            $location.url(routes.ERROR_PAGE);
                        });
                }
            }]
    });
