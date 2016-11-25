'use strict';

angular.module('currencySwapApp', [
    'ngRoute',
    'cookieManager',
    'appHeader',
    'appFooter',
    'errorPage',
    'permission',
    'loginForm',
    'verifyInfo',
    'resetPassword',
    'register',
    'userList',
    'common',
    'help',
    'support',
    'notification',
    'myProfile',
    'orders',
    'ngFileUpload',
    'homePage',
    'navigation',
    'angularCountryState',
    'ngSanitize',
    'ui.bootstrap',
]).run(function ($window, $rootScope, $location, CookieService, PermissionService, NavigationHelper) {

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

        if ($location.search().resetCode) {
            return $location.path(routes.FORGOT_PASSWORD_RESET);
        }

        if ($location.search().activeCode) {
            return $location.path(routes.REGISTER);
        }

        if ($location.path() != routes.LOGIN) {
            return $location.path(routes.LOGIN);
        } else return;
    }

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ( !$rootScope.loggedIn || !$rootScope.permissions ) return;

        if ( ! NavigationHelper.checkPermission() ) {
            return;
        }

        NavigationHelper.updateNavigationBar();

    });

    PermissionService.getCurrentPermission(token).then(
        function (response) {
            if (response.status === 299) {
                if (response.data.code == serverErrors.INVALID_TOKEN_API_KEY
                    || response.data.code == serverErrors.INVALID_TOKEN_API_KEY_FOR_USER) {

                    $rootScope.isLoading = false;
                    CookieService.cleanUpCookies();
                    $location.path(routes.LOGIN);
                }
            } else {
                $rootScope.permissions = response.data;
                $rootScope.loggedIn = true;
                $rootScope.isLoading = false;

                NavigationHelper.initNavigationBar();

                if ($location.path() == routes.LOGIN) return $location.path(routes.HOME);
            }


        }, function (error) {
            //var err = error.data;
            console.error('ERROR [%s] : %s.', err.code, err.message);
            $rootScope.isLoading = false;

            $rootScope.error = {};
            $rootScope.error.status = 'Unknown';
            $rootScope.error.message = 'Unknown error';
            $window.scrollTo(0, 0);
            /*if (err.code == serverErrors.INVALID_TOKEN_API_KEY ||
                err.code == serverErrors.INVALID_TOKEN_API_KEY_FOR_USER) {
                CookieService.cleanUpCookies();
                $location.path(routes.LOGIN);
            } else {
                $rootScope.error = {
                    status: error.status,
                    code: err.code,
                    message: err.message
                };
            }*/
        }
    );

}).constant('GLOBAL_CONSTANT', {
    HTTP_SUCCESS_STATUS_CODE: 200, // returned status from server for success case
    HTTP_ERROR_STATUS_CODE: 299, // returned status from server for error case (2xx not to get browser shows the errors)
    SERVER_GOT_PROBLEM_MSG: 'Server got problem',
    SERVER_GOT_PROBLEM_STATUS: 'ERROR',
    UNKNOWN_ERROR_MSG: 'Unknown error',
    UNKNOWN_ERROR_STATUS: 'Unknown',
    ACTIVATED_USER_STATUS: 'Activated',
    BLOCKED_USER_STATUS: 'Blocked',
    PENDING_USER_STATUS: 'Pending Approval',
    NEW_USER_STATUS: 'New',
    DEACTIVATED_USER_STATUS: 'Deactivated',
    INVALID_USER_NAME_OR_PWD_MSG: 'Invalid username/password',
    ACCOUNT_IS_NOT_ACTIVATED_MSG: 'Account is not activated',
    ACCOUNT_IS_EXPIRED: 'Your account was expired',
    ORDER_FIXED_VALUE : {
    	"RATE" : "RATE",
		"GIVE" : "GIVE",
		"GET" : "GET"
	},
	ORDER_EXPIRED_VALUE : [
		{"key" : "ON_3_DAY","value" : "on 3 days", "dayLive" : 3},
		{"key" : "ON_7_DAY","value" : "on 7 days", "dayLive" : 7},
		{"key" : "ON_2_WEEKS","value" : "on 2 weeks", "dayLive" : 14}
	]
}).filter('filterDate', function($filter){
	return function (date, format) {
	    if (!format) format = 'MMM dd, yyyy';
	    return $filter('date')(date, format);
	}
});
