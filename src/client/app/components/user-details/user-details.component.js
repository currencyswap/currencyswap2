'use strict';

angular.module('userDetails').component('userDetails', {
    templateUrl: 'app/components/user-details/user-details.template.html',
    controller: ['$scope',
        '$rootScope',
        '$routeParams',
        'CookieService',
        'PermissionService',
        '$location',
        '$http',
        '$window',
        'GLOBAL_CONSTANT',
        '$log',
        'UserDetailsServive',
        function userDetailsController($scope, $rootScope, $routeParams, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log, UserDetailsServive ) {
            console.log('userDetailsController %s', $routeParams.id );
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
                if($scope.isEditting)$scope.popup1.opened = true;
            };

            $scope.open2 = function() {
                if($scope.isEditting)$scope.popup2.opened = true;
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
            var token = CookieService.getToken();
            var headers = {};

            $scope.user = {};
            $scope.selectedStatus = {};
            $scope.isEditting = false;
            $scope.formats = ['MMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.userStatusesList = {};
            $scope.userStatusesList.activated = GLOBAL_CONSTANT.ACTIVATED_USER_STATUS;
            $scope.userStatusesList.blocked = GLOBAL_CONSTANT.BLOCKED_USER_STATUS;
            $scope.userStatusesList.pending = GLOBAL_CONSTANT.PENDING_USER_STATUS;
            $scope.userStatusesList.new = GLOBAL_CONSTANT.NEW_USER_STATUS;
            $scope.userStatusesList.deactivated = GLOBAL_CONSTANT.DEACTIVATED_USER_STATUS;

            headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
            headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

            UserDetailsServive.getUser( $routeParams.id, headers ).then(
                function ( response ) {
                    console.log("RESPONSE %s", JSON.stringify( response.data ) );          
                    $scope.user = response.data;
                    $scope.user.birthday = new Date( $scope.user.birthday );
                    $scope.user.expiredDate = new Date( $scope.user.expiredDate );
                    $scope.fullName = $scope.user.fullName;
                    $scope.selectedStatus.selectedStatus = $scope.user.status;
                }, function ( err ) {
                    console.error("ERROR : %s", JSON.stringify( err ) );
                    $rootScope.error = {
                        status: err.status,
                        code: err.data.code,
                        message: err.data.message
                    };
                });


            $scope.onSaveUserDetailData = function () {

                $scope.gifLoading = true;
                var address, city, country, postcode, state = null;
                if ($scope.user.addresses[0] && $scope.user.addresses[0].hasOwnProperty('address')) address = $scope.user.addresses[0].address;
                if ($scope.user.addresses[0] && $scope.user.addresses[0].hasOwnProperty('city')) city = $scope.user.addresses[0].city;
                if ($scope.user.addresses[0] && $scope.user.addresses[0].hasOwnProperty('state')) state = $scope.user.addresses[0].state;
                if ($scope.user.addresses[0] && $scope.user.addresses[0].hasOwnProperty('country')) country = $scope.user.addresses[0].country;
                if ($scope.user.addresses[0] && $scope.user.addresses[0].hasOwnProperty('postcode')) postcode = $scope.user.addresses[0].postcode;
                if ($scope.user.groupMember && $scope.user.groupMember === 'Standard Member') $scope.user.groupMember = GLOBAL_CONSTANT.STANDARD_USER_ROLE;

                var resultUser = {
                    id: $scope.user.id,
                    username: $scope.user.username,
                    birthday: $scope.user.birthday,
                    email: $scope.user.email,
                    expiredDate: $scope.user.expiredDate,
                    fullName: $scope.user.fullName,
                    registeredDate: $scope.user.registeredDate,
                    addresses: [
                        {
                            address: address,
                            city: city,
                            country: country,
                            postcode: postcode,
                            state: state
                        }
                    ],
                    profession: $scope.user.profession,
                    cellphone: $scope.user.cellphone,
                    nationalId: $scope.user.nationalId,
                    status: $scope.selectedStatus.selectedStatus,
                    group: $scope.user.groupMember
                };


                var token = CookieService.getToken();
                var headers = {};

                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                UserDetailsServive.saveUserDetail(resultUser, headers)
                    .then(function (response) {
                        $scope.isEditting = false;
                        if (response.status === GLOBAL_CONSTANT.HTTP_ERROR_STATUS_CODE) {
                            $scope.gifLoading = false;
                            if (response.data.code === serverErrors.CANNOT_SET_YOUR_OWN_ROLE) {
                                $scope.errorSetOwnRole = true;
                            }
                            if (response.data.code === serverErrors.UNKNOWN_GROUP
                                || response.data.code === serverErrors.SERVER_GET_PROBLEM
                                || response.data.code === serverErrors.CANNOT_FIND_ADDRESS_FOR_USER) {

                                $rootScope.isLoading = false;
                                $rootScope.error = {};
                                $rootScope.error.status = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_STATUS;
                                $rootScope.error.message = GLOBAL_CONSTANT.SERVER_GOT_PROBLEM_MSG;
                                $window.scrollTo(0, 0);
                            }
                        } else {
                            $scope.fullName = $scope.user.fullName;
                            $scope.isEditting = false;
                            $window.scrollTo(0, 0);
                            $scope.gifLoading = false;
                        }
                    }, function (error) {
                        $scope.gifLoading = false;
                        $rootScope.error = {};
                        $rootScope.error.status = GLOBAL_CONSTANT.UNKNOWN_ERROR_STATUS;
                        $rootScope.error.message = GLOBAL_CONSTANT.UNKNOWN_ERROR_MSG;
                        $window.scrollTo(0, 0);
                    });

            };



            $scope.changeStateToEdit = function () {
                $scope.isEditting = true;
            };
            $scope.changeRole = function () {
                $scope.errorSetOwnRole = false;
            };
            $scope.onBackStep = function(){
                $location.path(routes.USER_LIST);
                $window.scrollTo(0, 0);
            }
        }]
});
