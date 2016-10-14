'use strict';

angular.module('appHeader').directive('headerLeft', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/header/header-left.template.html',
        controller: function ($scope, $element ) {

            $scope.title = appConfig.title;

        }
    };
})
