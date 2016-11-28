'use-strict';

var checkValidPermission = function (permissions, requiredPermissions) {

    if (!requiredPermissions || requiredPermissions.length == 0) {
        return true;
    }

    for (var key in permissions) {
        if (requiredPermissions.indexOf(key) >= 0) {
            return true;
        }
    }

    return false;
};

angular.module('navigation', []).factory('NavigationHelper', ['$rootScope', '$location', 'CookieService', function ($rootScope, $location, CookieService) {
    return {
        initNavigationBar: function () {

            if (!$rootScope.permissions) return;

            $rootScope.navigationBar = [];
            $rootScope.menuBar = [];
            $rootScope.toolsBar = [];
            $rootScope.currentPage = {};

            navigation.forEach(function (navItem) {

                if (!navItem.position || navItem.position == global.NONE) return;
                if (!checkValidPermission($rootScope.permissions, navItem.requiredPermissions)) return;

                var pattern = new UrlPattern(navItem.route);

                var isActivated = pattern.match($location.path());

                if (isActivated) {
                    $rootScope.currentPage = {
                        name: navItem.name,
                        icon: navItem.icon
                    }
                }

                var item = {
                    route: pattern.stringify(),
                    routePattern : navItem.route,
                    name: navItem.name,
                    icon: navItem.icon,
                    isActivated: isActivated
                };

                if ( item.route == routes.MYPROFILE) {
                    item.isMyProfile = true;
                }
                if ( item.route == routes.LOGOUT) {
                    item.isLogout = true;
                }

                $rootScope.navigationBar.push(item);

                if (navItem.position == global.MENUBAR) {
                    $rootScope.menuBar.push(item);
                } else if (navItem.position == global.TOOLSBAR) {
                    $rootScope.toolsBar.push(item);
                }

            });
        },
        checkPermission: function () {
            $rootScope.error = null;

            var currNavItem = null;

            for (var idx in navigation) {

                var navItem = navigation[idx];
                if (!checkValidPermission($rootScope.permissions, navItem.requiredPermissions)) {
                    continue;
                }
                console.log("navItem.route===",navItem.route);
                var pattern = new UrlPattern(navItem.route);
                console.log('ROUTER MAP:',pattern, "====",$location.path());
                if (pattern.match($location.path())) {
                    currNavItem = navItem;
                    break;
                }
            }

            if (!currNavItem) {
                console.log('currNavItem === false');
                $rootScope.error = {
                    status: 404,
                    code: 0,
                    message: 'Page not found.'
                };
                return false;
            }

            return true;
        },
        updateNavigationBar : function () {
            if (!$rootScope.permissions) return;
            if (!$rootScope.navigationBar || $rootScope.navigationBar.length == 0) return;

            $rootScope.navigationBar.forEach( function ( navItem ) {
                
                var pattern = new UrlPattern( navItem.routePattern );

                if (pattern.match($location.path())) {
                    //console.log('>>> %s', $location.path() );
                    $rootScope.currentPage.name = navItem.name;
                    $rootScope.currentPage.icon = navItem.icon;
                    navItem.isActivated = true;
                } else {
                    navItem.isActivated = false;
                }

            });
        }

    }
}]);
