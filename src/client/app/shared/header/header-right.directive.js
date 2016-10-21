'use strict';

angular.module('appHeader').directive('headerRight', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/header/header-right.template.html',
        controller: function ($rootScope, $location, $scope, $element ) {

            $scope.user = {
                permissions: $rootScope.permissions
            };

            // Init Menu Item
            $scope.toolbarItems = [];

            initToolBarItems($scope.toolbarItems, $scope.user);

            console.log('PATH %s', $location.path());
            console.log('permissions %s', JSON.stringify($scope.user.permissions));
            console.log('toolbarItems: ', $scope.toolbarItems);
        }
    };
});

var checkValidPermission = function (permissions, requiredPermissions) {
    for (var key in permissions) {

        if (requiredPermissions.indexOf(key) >= 0) {
            return true;
        }

    }

    return false;

};

var initToolBarItems = function (toolbarItems, user) {
    navigation.forEach(function (navItem) {

        if (navItem.position != global.TOOLSBAR) return;
        if (!checkValidPermission(user.permissions, navItem.requiredPermissions)) return;

        var pattern = new UrlPattern( navItem.route );

        toolbarItems.push({
            route: pattern.stringify(),
            name: navItem.name,
            icon: navItem.icon,
            isActivated: false
        });
    });
};
