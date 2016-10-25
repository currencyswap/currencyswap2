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

            // Init Menu Item
            $scope.menuItems = $rootScope.menuBar;
        }
    };
});
