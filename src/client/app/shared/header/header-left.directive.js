'use strict';

function adjustmainpanelheight() {
    // Adjust mainpanel height
    var docHeight = jQuery(document).height();
    if (docHeight > jQuery('.mainpanel').height())
        jQuery('.mainpanel').height(docHeight);
}

function initDirective() {
    jQuery('.menutoggle').click(function () {

        var body = jQuery('body');
        var bodypos = body.css('position');

        if (bodypos != 'relative') {

            if (!body.hasClass('leftpanel-collapsed')) {
                body.addClass('leftpanel-collapsed');
                jQuery('.nav-bracket ul').attr('style', '');

                jQuery(this).addClass('menu-collapsed');

            } else {
                body.removeClass('leftpanel-collapsed chat-view');
                jQuery('.nav-bracket li.active ul').css({ display: 'block' });

                jQuery(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('leftpanel-show'))
                body.removeClass('leftpanel-show');
            else
                body.addClass('leftpanel-show');

            adjustmainpanelheight();
        }

    });
}

var checkValidPermission = function (permissions, requiredPermissions) {

    for (var key in permissions) {

        if (requiredPermissions.indexOf(key) >= 0) {
            return true;
        }

    }

    return false;

}

var initMenuItem = function (menuItems, user) {
    navigation.forEach(function (navItem) {

        if (navItem.position != global.MENUBAR) return;
        if (!checkValidPermission(user.permissions, navItem.requiredPermissions)) return;

        var pattern = new UrlPattern( navItem.route );

        menuItems.push({
            route: pattern.stringify(),
            name: navItem.name,
            icon: navItem.icon,
            isActivated: false
        });

    });
}

angular.module('appHeader').directive('headerLeft', function () {
    return {
        restrict: 'EA',
        scope: {
            name: '@',
        },
        templateUrl: 'app/shared/header/header-left.template.html',
        controller: function ($rootScope, $cookies, $location, $scope, $element) {
            $scope.title = appConfig.title;
            initDirective();

            $scope.user = {
                permissions: $rootScope.permissions
            };

            // Init Menu Item
            $scope.menuItems = [];

            initMenuItem($scope.menuItems, $scope.user);

            console.log('PATH %s', $location.path());
            console.log('permissions %s', JSON.stringify($scope.user.permissions));
        }
    };
})
