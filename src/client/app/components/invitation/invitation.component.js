'use strict';

angular.module('invitation')
    .component('invitation', {
        templateUrl: 'app/components/invitation/invitation.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            '$window',
            'InvitationService',
            'GLOBAL_CONSTANT',
            function inviteController($scope, $rootScope, $location, $http, $window, InvitationService, GLOBAL_CONSTANT) {
                $scope.title = appConfig.title;
                $scope.isSubmitEmailForm = true;

                $scope.submitEmail = function (submittedEmail) {
                    InvitationService.invite(submittedEmail)
                        .then(function (response) {
                            console.log('is it here ???');
                            $scope.isSubmitSuccess = true;
                            $scope.$apply();
                        }, function (err) {
                            console.log('error on submit invite request');
                        })
                };

                $scope.onTextBoxChange = function () {
                    $scope.isEmailExisted = false;
                }
            }]
    });