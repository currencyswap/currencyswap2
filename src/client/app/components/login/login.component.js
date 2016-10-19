'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$rootScope', '$scope', '$http', function loginController($rootScope, $scope, $http) {
            $scope.test = 'Currency Swap';
    }]
});
