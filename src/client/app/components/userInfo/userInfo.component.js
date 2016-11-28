/**
 * Created by thapnd on 11/28/2016.
 */
'use strict';
angular.module('userInfo').filter('offset', function() {
    return function(input, start) {
        return input.slice(start);
    };
}).config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when(routes.USER, {
                templateUrl: "app/components/userInfo/userInfo.template.html",
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
                    function userInfoController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
                        console.log('userInfoController');
                        debugger;
                    }]
            });
    }]);

// angular.module('userInfo',[]).filter('offset', function() {
//     return function(input, start) {
//         return input.slice(start);
//     };
// }).component('userInfo', {
//         templateUrl: 'app/components/userInfo/userInfo.template.html',
//         controller: ['$scope',
//             '$rootScope',
//             'UserListService',
//             'CookieService',
//             'PermissionService',
//             '$location',
//             '$http',
//             '$window',
//             'GLOBAL_CONSTANT',
//             '$log',
//             function userInfoController($scope, $rootScope, UserListService, CookieService, PermissionService, $location, $http, $window, GLOBAL_CONSTANT, $log) {
//                 console.log('userInfoController');
//                 debugger;
//             }]
//     });
