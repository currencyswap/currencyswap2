'use strict';

angular.module('loginForm')
    .component('loginForm', {
        templateUrl: 'app/components/login/login.template.html',
        controller: ['$scope', '$http', function loginController($scope, $http, LoginService ) {
            $scope.title = appConfig.title;
    }]
});
