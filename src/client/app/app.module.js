'use strict';

angular.module('currencySwapApp', [
    'ngRoute',
    'cookieManager',
    'appHeader',
    'errorPage',
    'permission',
    'loginForm',
    'verifyInfo',
    'resetPassword',
    'register',
    'homePage',
    'navigation'
]).run(function ($rootScope, $location, CookieService, PermissionService, NavigationHelper ) {

    var token = CookieService.getToken();
    $rootScope.loggedIn = false;
    $rootScope.isLoading = true;
    $rootScope.error = null;
    $rootScope.currentPage = {};

    if (!token) {
        $rootScope.isLoading = false;
        if ($location.path() === routes.FORGOT_PASSWORD_VERIFY) {
            return $location.path(routes.FORGOT_PASSWORD_VERIFY);
        }

        if ($location.path() === routes.FORGOT_PASSWORD_RESET) {
            return $location.path(routes.FORGOT_PASSWORD_RESET);
        }

        if ($location.path() != routes.LOGIN) {
            return $location.path(routes.LOGIN);
        } else return;
    }

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        console.log('come here ???');
        if ( !$rootScope.loggedIn || !$rootScope.permissions ) return;

        if ( ! NavigationHelper.checkPermission() ) {
            return;
        }

        NavigationHelper.updateNavigationBar();

    });

    PermissionService.getCurrentPermission(token).then(
        function (response) {
            $rootScope.permissions = response.data;
            $rootScope.loggedIn = true;
            $rootScope.isLoading = false;

            NavigationHelper.initNavigationBar();

            if ($location.path() == routes.LOGIN) return $location.path(routes.HOME);

        }, function (error) {
            let err = error.data;
            console.error('ERROR [%s] : %s.', err.code, err.message);
            $rootScope.isLoading = false;

            if (err.code == serverErrors.INVALID_TOKEN_API_KEY ||
                err.code == serverErrors.INVALID_TOKEN_API_KEY_FOR_USER) {
                CookieService.cleanUpCookies();
                if ($location.path() != routes.LOGIN) return $location.path(routes.LOGIN);
            } else {
                $rootScope.error = {
                    status: error.status,
                    code: err.code,
                    message: err.message
                };
            }
        }
    );

}).constant('GLOBAL_CONSTANT', {
}).constant('ERROR_MSG', {
    INVALID_USR_OR_PWD_MSG: 'Invalid username or password !',
    EMPTY_USR_OR_PWD_MSG: 'Empty username or password !'
});