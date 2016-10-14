'use strict';

angular.module('appHeader').directive('leftPanel', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/header/left-panel.template.html',
        controller: function ($scope, $element ) {

            $scope.title = appConfig.title;

        }
    };
})
