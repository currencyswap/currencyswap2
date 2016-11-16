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
            function myProfileController($scope, $rootScope, $location, $window, $timeout, $http, Upload, CookieService, LoginService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                $rootScope.loading = true;
                $scope.model = {};
                var currentUser = CookieService.getCurrentUser();

                var profilePicReq = {
                    method: httpMethods.GET,
                    url: 'http://localhost:3000/config/' + currentUser.username
                };

                $http(profilePicReq)
                    .then(function (response) {
                        return;
                    });

                var token = CookieService.getToken();
                var headers = {};

                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                var userDetailReq = {
                    method: httpMethods.GET,
                    url: apiRoutes.API_MY_PROFILE,
                    headers: headers,
                };

                $http(userDetailReq)
                    .then(function (response) {
                        var userDetail = response.data;
                        console.log(userDetail);
                        $scope.model.username = userDetail.username;
                        $scope.model.birthday = userDetail.birthday;
                        $scope.model.email = userDetail.email;
                        $scope.model.expiredDate = new Date(userDetail.expiredDate);
                        $scope.model.registeredDate = new Date(userDetail.registeredDate);
                        $scope.model.fullName = userDetail.fullName;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('address')) $scope.model.address = userDetail.addresses[0].address;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('city')) $scope.model.city = userDetail.addresses[0].city;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('state')) $scope.model.state = userDetail.addresses[0].state;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('country')) $scope.model.country = userDetail.addresses[0].country;
                        if (userDetail.addresses[0] && userDetail.addresses[0].hasOwnProperty('postcode')) $scope.model.postcode = userDetail.addresses[0].postcode;
                        $scope.model.cellphone = userDetail.cellphone;
                        $scope.model.nationalId = userDetail.nationalId;
                        $scope.model.profession = userDetail.profession;
                    });

                $scope.uploadFiles = function(file, errFiles) {
                    $scope.f = file;
                    $scope.errFile = errFiles && errFiles[0];

                    if (file) {
                        file.upload = Upload.upload({
                            method: 'POST',
                            url: 'http://localhost:3000/api/profile',
                            data: {
                                file: file
                            },
                            headers: headers
                        });

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        });
                    }
                };

                $scope.isEditting = false;
                $scope.calendarPicker = {
                    opened: false
                };
                $scope.birthday = new Date();
                $scope.openCalendar = function() {
                    $scope.calendarPicker.opened = true;
                };
                $scope.formatDate = function(date){
                    var dateOut = new Date(date);
                    return dateOut;
                };
                $scope.openCalendar1 = function() {
                    $scope.calendarPicker.opened1 = true;
                };

                $scope.changeStateToEdit = function () {
                    $scope.isEditting = true;
                };

                $scope.saveUserInfo = function () {
                    $scope.isEditting = false;

                    var updatingUser = {
                        username: $scope.model.username,
                        birthday: $scope.model.birthday,
                        email: $scope.model.email,
                        expiredDate: $scope.model.expiredDate,
                        fullName: $scope.model.fullName,
                        registeredDate: $scope.model.registeredDate,
                        addresses: [
                            {
                                address: $scope.model.address,
                                city: $scope.model.city,
                                country: $scope.model.country,
                                postcode: $scope.model.postcode
                            }
                        ],
                        profession: $scope.model.profession,
                        cellphone: $scope.model.cellphone,
                        nationalId: $scope.model.nationalId,
                        currentPwd: $scope.model.currentPwd,
                        newPwd: $scope.model.newPwd
                    };
                    console.log("updatingUser",updatingUser);
                    debugger;
                    var saveUserDetailReq = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_MY_PROFILE,
                        headers: headers,
                        data: updatingUser
                    };

                    $http(saveUserDetailReq)
                        .then(function (response) {
                            $location.path(routes.MYPROFILE);
                            $window.location.reload();
                        });
                }
            }]
    });
