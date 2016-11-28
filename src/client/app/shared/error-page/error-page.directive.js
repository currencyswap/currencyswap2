'use strict';

/*angular.module('errorPage').directive('errorPage', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/error-page/error-page.template.html',
        controller: function ($rootScope, $scope, $element) {
            console.log('come to error page directive');
            $scope.status = $rootScope.error.status;            
            $scope.code = $rootScope.error.code;
            $scope.message = $rootScope.error.message;
        }
    };
});*/


angular.module('errorPage')
    .component('errorPage', {
        templateUrl: 'app/shared/error-page/error-page.template.html',
        controller: [
            '$rootScope',
            '$scope',
            'GLOBAL_CONSTANT',
            '$window',
            '$location',
            function errorPageController($rootScope, $scope, GLOBAL_CONSTANT, $window, $location) {
                $scope.error = $rootScope.error;

                $scope.activeLinkExpiredError = $scope.error.name === GLOBAL_CONSTANT.ACTIVE_CODE_EXPIRED_ERROR.name;

                $window.scrollTo(0, 0);

                $scope.backToRegister = function () {
                    $location.url(routes.REGISTER);
                };

                $scope.backToLogin = function () {
                    $location.url(routes.LOGIN);
                };
        }]
    });
