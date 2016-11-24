'use strict';

angular.module('support')
    .component('support', {
        templateUrl: 'app/components/support/support.template.html',
        controller: ['$scope',
            '$rootScope',
            '$timeout',
            'SupportService',
            'PermissionService',
            'NavigationHelper',
            'GLOBAL_CONSTANT',
            function supportController($scope, $rootScope, $timeout, SupportService, PermissionService, NavigationHelper, GLOBAL_CONSTANT) {
                var user = $rootScope.user;
                console.log(user);
                var _checkAdmin = function() {
                    if (user && user.groups && user.groups.length > 0) {
                        for (var i=0; i<user.groups.length; i++) {
                            var group = user.groups[i];
                            if (group.name === 'Admin') {
                                $scope.messageTitle = 'Message to Users';
                                $scope.support.isAdmin = true;
                                break;
                            }
                        }
                    }
                };
                
                $scope.messageTitle = 'Message to Admin';
                $scope.support = {title: '', message: '', group: true, username: user.username, creatorId: user.id};
                $scope.init = function() {
                    $('[data-toggle="popover"]').popover();
                    _checkAdmin();
                };
                $scope.save = function() {
                    console.log('save')
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
