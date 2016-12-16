'use strict';

angular.module('invite')
    .component('invite', {
        templateUrl: 'app/components/invite/invite.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            '$window',
            'InviteService',
            'GLOBAL_CONSTANT',
            function inviteController($scope, $rootScope, $location, $http, $window, InviteService, GLOBAL_CONSTANT) {
                $scope.title = appConfig.title;

                $scope.submitEmail = function (submittedEmail) {
                    InviteService.invite(submittedEmail)
                        .then(function (response) {
                            console.log('response from server: ', response);
                        })
                };

                $scope.onTextBoxChange = function () {
                    $scope.isEmailExisted = false;
                }
            }]
    });