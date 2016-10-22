'use strict';

angular.module('appHeader').directive('headerRight', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/header/header-right.template.html',
        controller: function ($rootScope, $location, $scope, $element) {

            $scope.user = {
                permissions: $rootScope.permissions
            };

            // Init Menu Item
            $scope.toolbarItems = $rootScope.toolbarItems;

            initToolBarItems($scope.toolbarItems, $scope.user, $location.path(), $rootScope.currentPage);

            $scope.onChangeItem = function (path) {
                $rootScope.menuItems.forEach(function (item) {
                    item.isActivated = false;
                });

                $scope.toolbarItems.forEach(function (item) {
                    item.isActivated = (item.route == path);
                    if (item.isActivated) {
                        $rootScope.currentPage.name = item.name;
                        $rootScope.currentPage.icon = item.icon;
                    }
                });
            };
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

var initToolBarItems = function (toolbarItems, user, path, currentPage) {
    navigation.forEach(function (navItem) {

        if (navItem.position != global.TOOLSBAR) return;
        if (!checkValidPermission(user.permissions, navItem.requiredPermissions)) return;

        var pattern = new UrlPattern(navItem.route);
        var isActivated = pattern.match(path);

        if (isActivated) {
            currentPage.name = navItem.name;
            currentPage.icon = navItem.icon;
        }

        toolbarItems.push({
            route: pattern.stringify(),
            name: navItem.name,
            icon: navItem.icon,
            isActivated: isActivated
        });
    });
};
