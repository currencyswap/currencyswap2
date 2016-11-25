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
            function userListController($scope, $rootScope, UserListService,CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
                $window.scrollTo(0,0);
                // =====Date picker - START=====
                $scope.today = function() {
                    $scope.dt = new Date();
                };
                $scope.today();
                $scope.isEditting = false;
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

                $scope.role = "Standard Member";
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

                $scope.selectedStatus = {};

                $scope.onSaveUserDetailData = function () {
                    $scope.gifLoading = true;
                    var address, city, country, postcode, state = null;
                    if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('address')) address = $scope.userDetail.addresses[0].address;
                    if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('city')) city = $scope.userDetail.addresses[0].city;
                    if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('state')) state = $scope.userDetail.addresses[0].state;
                    if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('country')) country = $scope.userDetail.addresses[0].country;
                    if ($scope.userDetail.addresses[0] && $scope.userDetail.addresses[0].hasOwnProperty('postcode')) postcode = $scope.userDetail.addresses[0].postcode;

                    console.log("$scope.userDetail.addresses: ",$scope.userDetail.addresses);
                    var resultUser = {
                        id: $scope.userDetail.id,
                        username: $scope.userDetail.username,
                        birthday: $scope.userDetail.birthday,
                        email: $scope.userDetail.email,
                        expiredDate: $scope.userDetail.expiredDate,
                        fullName: $scope.userDetail.fullName,
                        registeredDate: $scope.userDetail.registeredDate,
                        addresses: [
                            {
                                address: address,
                                city: city,
                                country: country,
                                postcode: postcode,
                                state: state
                            }
                        ],
                        profession: $scope.userDetail.profession,
                        cellphone: $scope.userDetail.cellphone,
                        nationalId: $scope.userDetail.nationalId,
                        status: $scope.selectedStatus.selectedStatus
                    };


                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.saveUserDetail(resultUser, headers)
                        .then(function (response) {
                            console.log("response:",response);
                            $scope.isEditting = false;
                            $window.scrollTo(0, 0);
                            $scope.gifLoading = false;
                        })

                };
                $scope.listStatus = [GLOBAL_CONSTANT.ACTIVATED_USER_STATUS,GLOBAL_CONSTANT.PENDING_USER_STATUS,GLOBAL_CONSTANT.BLOCKED_USER_STATUS];
                $scope.formatDate = function(date){
                    var dateOut = new Date(date);
                    return dateOut;
                };
                $scope.changeStateToEdit = function () {
                    $scope.isEditting = true;
                };
                $scope.onAllClick = function () {
                    $scope.isEditting = false;
                    $scope.detailUserView = false;

                    $scope.users = [];
                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;
                    var  success = function () {
                        console.log("success");
                    }
                    var  failed = function () {
                        console.log("failed");
                    }
                    UserListService.fetchAllUser(headers,success,failed)
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
                    $scope.isEditting = false;
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
                                $scope.totalItems = $scope.users.length;
                            } else {
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            }
                        });
                };

                $scope.onPendingClick = function () {
                    $scope.detailUserView = false;
                    $scope.isEditting = false;
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
                                    if (user.status === GLOBAL_CONSTANT.PENDING_USER_STATUS) {
                                        $scope.users.push(user);
                                    } else {
                                        //do nothing
                                    }
                                })
                                $scope.totalItems = $scope.users.length;
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
                            var address1, city1, country1, postcode1, state1 = null;
                            $scope.userDetail = {};
                            var userDetail = response.data;
                            $scope.userDetail.id = userDetail.id;
                            $scope.userDetail.birthday = new Date(userDetail.birthday);
                            $scope.userDetail.expiredDate = new Date(userDetail.expiredDate);
                            $scope.userDetail.username = userDetail.username;
                            $scope.userDetail.addresses = userDetail.addresses;
                            $scope.userDetail.cellphone = userDetail.cellphone;
                            $scope.userDetail.email = userDetail.email;
                            $scope.userDetail.nationalId = userDetail.nationalId;
                            $scope.userDetail.profession = userDetail.profession;
                            $scope.selectedStatus.selectedStatus = userDetail.status;
                            $scope.userDetailclone = $scope.userDetail;
                           })
                };
            }]
    });
