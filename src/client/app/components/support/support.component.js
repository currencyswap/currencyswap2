'use strict';

angular.module('support')
    .component('support', {
        templateUrl: 'app/components/support/support.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'CookieService',
            'SupportService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function supportController($scope, $rootScope, $timeout, CookieService, SupportService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                var user = CookieService.getCurrentUser();

                $scope.messageTitle = 'Message to Admin';
                $scope.support = {title: '', message: '', group: true, username: user.username};
                $scope.init = function() {
                    $('[data-toggle="popover"]').popover();
//                    SupportService.getCreator(user.username).then(function(resp){
//                        console.log(resp);
//                    }, function(err){
//                        console.log(err);
//                    });
                };
                $scope.save = function() {
                    $scope.message = '';
                    SupportService.saveSupport($scope.support).then(function(resp){
                        console.log('Successful in saving message');
                        $timeout(function(){
                            $scope.message = 'Successful: Your message has been sent to Admin';
                            $scope.support.title = '';
                            $scope.support.message = '';
                        });
                    }, function(err){
                        console.log('Failure in saving your message');
                        $timeout(function(){
                            $scope.message = 'Failure: Could not send your message due to system error. Please try again later!';
                        });
                    });
                };

                // init
                $scope.init();
            }]
    });
