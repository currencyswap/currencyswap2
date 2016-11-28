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
                    console.error("ERROR : %s", err );
                    $rootScope.error = {
                        status: error.status,
                        code: err.code,
                        message: err.message
                    };
                });
            $scope.changeStateToEdit = function () {
                $scope.isEditting = true;
            };
            $scope.changeRole = function () {
                $scope.errorSetOwnRole = false;
            };
            $scope.onBackStep = function(){
                $location.path(routes.USERS);
                $window.scrollTo(0, 0);
            }
        }]
});
