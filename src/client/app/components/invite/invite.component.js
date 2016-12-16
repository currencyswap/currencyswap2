'use strict';

angular.module('invite')
    .component('invite', {
        templateUrl: 'app/components/invite/invite.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            '$window',
            'GLOBAL_CONSTANT',
            function inviteController($scope, $rootScope, $location, $http, $window, GLOBAL_CONSTANT) {
                $scope.title = appConfig.title;
            }]
    });