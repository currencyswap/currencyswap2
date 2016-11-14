'use strict';

angular.module('userList')
    .filter('offset', function() {
    return function(input, start) {
        return input.slice(start);
    };
}).component('userList', {
        templateUrl: 'app/components/usersList/userList.template.html',
        controller: ['$scope',
            '$rootScope',
            'UserListService',
            'CookieService',
            'PermissionService',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            '$log',
            function userListController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {

                $scope.alerts = [{ type: 'success', msg: 'Saved successfully' }];

                $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                };
                // =====Date picker - START=====
                $scope.today = function() {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function() {
                    $scope.dt = null;
                };

                $scope.inlineOptions = {
                    customClass: getDayClass,
                    minDate: new Date(),
                    showWeeks: true
                };

                $scope.dateOptions = {
                    dateDisabled: disabled,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };

                // Disable weekend selection
                function disabled(data) {
                    var date = data.date,
                        mode = data.mode;
                    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                }

                $scope.toggleMin = function() {
                    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
                };

                $scope.toggleMin();

                $scope.open1 = function() {
                    $scope.popup1.opened = true;
                };

                $scope.open2 = function() {
                    $scope.popup2.opened = true;
                };

                $scope.setDate = function(year, month, day) {
                    $scope.dt = new Date(year, month, day);
                };

                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
                $scope.altInputFormats = ['M!/d!/yyyy'];

                $scope.birthday = new Date();

                $scope.popup1 = {
                    opened: false
                };

                $scope.popup2 = {
                    opened: false
                };

                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                var afterTomorrow = new Date();
                afterTomorrow.setDate(tomorrow.getDate() + 1);
                $scope.events = [
                    {
                        date: tomorrow,
                        status: 'full'
                    },
                    {
                        date: afterTomorrow,
                        status: 'partially'
                    }
                ];

                function getDayClass(data) {
                    var date = data.date,
                        mode = data.mode;
                    if (mode === 'day') {
                        var dayToCheck = new Date(date).setHours(0,0,0,0);

                        for (var i = 0; i < $scope.events.length; i++) {
                            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                            if (dayToCheck === currentDay) {
                                return $scope.events[i].status;
                            }
                        }
                    }

                    return '';
                }
                // =====Date picker - END=====

                $scope.sortType     = 'fullName'; // set the default sort type
                $scope.sortReverse  = false;  // set the default sort order
                //$scope.searchFish   = '';     // set the default search/filter

                $scope.users = [];
                $scope.allUser = [];

                $scope.current = 1;
                $scope.itemsPerPage = 5;
                $scope.maxSize = 1;

                $scope.detailUserView = false;

                $scope.userStatusesList = {};
                $scope.userStatusesList.activated = GLOBAL_CONSTANT.ACTIVATED_USER_STATUS;
                $scope.userStatusesList.blocked = GLOBAL_CONSTANT.BLOCKED_USER_STATUS;
                $scope.userStatusesList.pending = GLOBAL_CONSTANT.PENDING_USER_STATUS;
                $scope.userStatusesList.new = GLOBAL_CONSTANT.NEW_USER_STATUS;
                $scope.userStatusesList.deactivated = GLOBAL_CONSTANT.DEACTIVATED_USER_STATUS;

                $scope.model = {};
                $scope.model.saveSuccess = false;

                $scope.onSaveUserDetailData = function () {
                    $scope.gifLoading = true;
                    var resultUser = {
                        id: $scope.userDetail.id,
                        username: $scope.model.username,
                        email: $scope.model.email,
                        cellphone: $scope.model.cellphone,
                        nationalId: $scope.model.nationalId,
                        birthday: $scope.model.birthday,
                        expiredDate: $scope.model.expDate,
                        profession: $scope.model.profession,
                        addresses: [
                            {
                                address: $scope.model.address,
                                country: $scope.model.country,
                                state: $scope.model.state,
                                city: $scope.model.city

                            }
                        ],
                        status: $scope.model.selectedStatus,
                    };

                    console.log(resultUser);

                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.saveUserDetail(resultUser, headers)
                        .then(function (response) {
                            $scope.gifLoading = false;
                            if (response.data === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) {
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            } else {
                                $scope.model.saveSuccess = true;
                            }
                        })

                };

                $scope.onAllClick = function () {
                    $scope.detailUserView = false;

                    $scope.users = [];
                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.fetchAllUser(headers)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                $scope.allUsers = response.data;
                                $scope.users = $scope.allUsers;
                                $scope.totalItems = $scope.users.length;
                            } else {
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            }
                        });
                };

                $scope.onAllClick();

                $scope.onActivatedClick = function () {
                    $scope.detailUserView = false;

                    $scope.users = [];
                    $scope.allUser = [];

                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.fetchAllUser(headers)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                $scope.allUsers = response.data;
                                $scope.allUsers.forEach(function (user) {
                                    if (user.status === GLOBAL_CONSTANT.ACTIVATED_USER_STATUS) {
                                        $scope.users.push(user);
                                    } else {
                                        //do nothing
                                    }
                                })
                            } else {
                                /*$rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);*/
                            }
                        });
                };

                $scope.onPendingClick = function () {
                    $scope.detailUserView = false;

                    $scope.users = [];
                    $scope.allUser = [];

                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.fetchAllUser(headers)
                        .then(function (response) {
                            if (response.status === GLOBAL_CONSTANT.HTTP_SUCCESS_STATUS_CODE) {
                                $scope.allUsers = response.data;
                                $scope.allUsers.forEach(function (user) {
                                    if (user.status === GLOBAL_CONSTANT.PEDING_USER_STATUS) {
                                        $scope.users.push(user);
                                    } else {
                                        //do nothing
                                    }
                                })
                            } else {
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            }
                        });
                };

                $scope.showUserDetail = function (userId) {
                    $scope.detailUserView = true;
                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.getUserDetail(userId, headers)
                        .then(function (response) {
                            if (response.data === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) {
                                $rootScope.error = {};
                                 $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                 $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                 $window.scrollTo(0, 0);
                            } else {
                                $scope.userDetail = response.data;
                                $scope.model.username = $scope.userDetail.username;
                                $scope.model.email = $scope.userDetail.email;
                                $scope.model.cellphone = $scope.userDetail.cellphone;
                                $scope.model.nationalId = $scope.userDetail.nationalId;
                                $scope.model.birthday = new Date($scope.userDetail.birthday);
                                $scope.model.expDate = new Date($scope.userDetail.expiredDate);
                                $scope.model.profession = $scope.userDetail.profession;

                                if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('country')) $scope.model.country = $scope.userDetail.addresses[0].country;
                                if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('state')) $scope.model.state = $scope.userDetail.addresses[0].state;
                                if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('city')) $scope.model.city = $scope.userDetail.addresses[0].city;
                                if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('address')) $scope.model.address = $scope.userDetail.addresses[0].address;

                                $scope.model.selectedStatus = $scope.userDetail.status;
                                /*$rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);*/
                            }
                        })
                }
            }]
    });
