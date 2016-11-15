'use strict';

angular.module('myProfile')
    .component('myProfile', {
        templateUrl: 'app/components/myProfile/myProfile.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$window',
            'CookieService',
            'LoginService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function myProfileController($scope, $rootScope, $location, $window, CookieService, LoginService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                $scope.isEditting = false;
                $scope.calendarPicker = {
                    opened: false
                };
                $scope.birthday = new Date();
                $scope.openCalendar = function() {
                    $scope.calendarPicker.opened = true;
                };

                $scope.changeStateToEdit = function () {
                    $scope.isEditting = true;
                }

                $scope.saveUserInfo = function () {
                    $scope.isEditting = false;
                }
            }]
    });
