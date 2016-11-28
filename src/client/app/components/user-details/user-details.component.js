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

            headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
            headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

            UserDetailsServive.getUser( $routeParams.id, headers ).then(
                function ( response ) {
                    console.log("RESPONSE %s", JSON.stringify( response.data ) );          
                    $scope.user = response.data;
                    $scope.user.birthday = new Date( $scope.user.birthday );
                    $scope.user.expiredDate = new Date( $scope.user.expiredDate );
                }, function ( err ) {
                    console.error("ERROR : %s", JSON.stringify( err ) );
                    $rootScope.error = {
                        status: err.status,
                        code: err.data.code,
                        message: err.data.message
                    };
                });
        }]
});
