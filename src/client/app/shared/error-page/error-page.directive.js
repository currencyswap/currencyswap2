'use strict';

angular.module('errorPage').directive('errorPage', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/error-page/error-page.template.html',
        controller: function ($rootScope, $scope, $element) {
            $scope.status = $rootScope.error.status;            
            $scope.code = $rootScope.error.code;
            $scope.message = $rootScope.error.message;
        }
    };
});
