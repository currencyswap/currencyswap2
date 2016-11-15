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

                $scope.selectedStatus = {};

                $scope.onSaveUserDetailData = function () {
                    var resultUser = {
                        status: $scope.selectedStatus.selectedStatus
                    };

                    var token = CookieService.getToken();
                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                    UserListService.saveUserDetail(resultUser, headers)
                        .then(function (response) {
                            console.log(response.data);
                        })

                };
                $scope.formatDate = function(date){
                    var dateOut = new Date(date);
                    return dateOut;
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
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
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
                            $scope.userDetail = response.data;
                            $scope.birthday = new Date($scope.userDetail.birthday);
                            console.log("$scope.userDetail==",$scope.birthday);
                            console.log("$scope.dt==",$scope.dt);
                            $scope.selectedStatus.selectedStatus = $scope.userDetail.status;
                        })
                }
            }]
    });
