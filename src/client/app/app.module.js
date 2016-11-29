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
    'userDetails',
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
    
    var init = function() {
        $rootScope.$on("$routeChangeStart", routeChanged);
        //$rootScope.$on("$locationChangeStart", routeChanged);

        if (!token) {
            $rootScope.isLoading = false;

            if ($location.path() === routes.FORGOT_PASSWORD_VERIFY) {
                CookieService.cleanUpCookies();
                return $location.path(routes.FORGOT_PASSWORD_VERIFY);
            }

            if ($location.search().resetCode) {
                CookieService.cleanUpCookies();
                return $location.path(routes.FORGOT_PASSWORD_RESET);
            }

            if ($location.search().activeCode) {
                $rootScope.isLoading = false;
                return $location.path(routes.REGISTER);
            }

            if ($location.path() != routes.LOGIN) {
                return $location.path(routes.LOGIN);
            } else {
                console.log('Unknown action, nothing need to be done at this point');
                return;
            }
        } else {
            if ($location.path() === routes.FORGOT_PASSWORD_VERIFY) {
                $rootScope.isLoading = false;
                CookieService.cleanUpCookies();
                return $location.path(routes.FORGOT_PASSWORD_VERIFY);
            }

            if ($location.search().resetCode) {
                $rootScope.isLoading = false;
                CookieService.cleanUpCookies();
                return $location.path(routes.FORGOT_PASSWORD_RESET);
            }
        }
        
        retreiveUserPerm();
    };
    
    
    var redirectToDefaultPath = function () {
        if ($location.path() == routes.LOGIN || 
            $location.path() == routes.ROOT || 
            $location.path() == routes.HOME ) {

            var defaultPath = routes.HOME;

            if ( $rootScope.permissions && $rootScope.permissions.USER_MANAGEMENT ) {
                defaultPath = routes.USER_LIST;
            } else if ( $rootScope.permissions && $rootScope.permissions.MAINTAIN_OWN_ORDERS ) {
                defaultPath = routes.ORDERS;
            }
            
            return $location.path( defaultPath );
        }
    };

    var routeChanged = function (event, next, current) {
        if ( !$rootScope.loggedIn || !$rootScope.permissions ) return;

        redirectToDefaultPath();

        if ( ! NavigationHelper.checkPermission() ) {
            return;
        }

        NavigationHelper.updateNavigationBar();

    };

    var retreiveUserPerm = function() {
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

                        redirectToDefaultPath();
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
    };

    // running initialize
    init();
}).constant('GLOBAL_CONSTANT', {
    HTTP_SUCCESS_STATUS_CODE: 200, // returned status from server for success case
    HTTP_ERROR_STATUS_CODE: 299, // returned status from server for error case (2xx not to get browser shows the errors)
    ACTIVE_CODE_EXPIRED_ERROR: {
        name: 'ACTIVE_CODE_EXPIRED_ERROR',
        code: 410,
        status: 'ACTIVE URL IS EXPIRED',
        message: 'Your active URL is expired and removed from our system. Please help to try to register again '
    },
    COULD_NOT_DECRYPT_ACTIVE_ACC_CODE_ERROR: {
        name: 'COULD_NOT_DECRYPT_ACTIVE_ACC_CODE_ERROR',
        code: 400,
        status: 'ACTIVE URL DOES NOT EXIST',
        message: 'Your active URL does not exist in our system, maybe something wrong happens when clicking on the URL. Please try again  '
    },
    SERVER_GOT_PROBLEM_ERROR: {
        name: 'SERVER_GOT_PROBLEM_ERROR',
        code: 500,
        status: 'SERVER GOT PROBLEM',
        message: 'Something wrong happens with our server, please try again or come back later '
    },
    UNKNOWN_ERROR: {
        name: 'UNKNOWN_ERROR',
        code: 500,
        status: 'UNKNOWN ERROR',
        message: 'System got an unknown error, please try again or come back later'
    },
    BAD_REQUEST_ERROR: {
        name: 'BAD_REQUEST_ERROR',
        code: 400,
        status: 'BAD REQUEST',
        message: 'Something wrong with your request, please try again'
    },
    RESET_CODE_EXPIRED_ERROR: {
        name: 'RESET_CODE_EXPIRED_ERROR',
        code: 410,
        status: 'RESET URL IS EXPIRED',
        message: 'Your active URL is expired and removed from our system. Please help to try to register again '
    },
    EMAIL_COULD_NOT_BE_SENT: {
        name: 'EMAIL_COULD_NOT_BE_SENT',
        code: 503,
        status: 'EMAIL COULD NOT BE SENT',
        message: 'Something wrong happens when sending reset URL to your email, please try again '
    },
    COULD_NOT_DECRYPT_RESET_PWD_CODE_ERROR: {
        name: 'COULD_NOT_DECRYPT_RESET_PWD_CODE_ERROR',
        code: 400,
        status: 'RESET PASSWORD URL DOES NOT EXIST',
        message: 'Your reset password URL does not exist in our system, maybe something wrong happens when clicking on the URL. Please try again '
    },
    NO_PERMISSION: {
        name: 'NO_PERMISSION',
        code: 400,
        status: 'NO PERMISSION',
        message: 'You have no permission to access this page '
    },
    ACTIVATED_USER_STATUS: 'Activated',
    BLOCKED_USER_STATUS: 'Blocked',
    PENDING_USER_STATUS: 'Pending Approval',
    NEW_USER_STATUS: 'New',
    STANDARD_USER_ROLE: 'User',
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
	],
	STATUS_TYPE : {
        SUBMITTED: "Submitted",
        SWAPPING: "Swapping",
        CONFIRMED: "Confirmed",
        PENDING: "Pending",
        CLEARED: "Cleared",
        CANCELED: "Canceled",
        EXPIRED: "Expired",
        SUBMITTED_ID: 1,
        SWAPPING_ID: 2,
        CONFIRMED_ID: 3,
        PENDING_ID: 4,
        CLEARED_ID: 5,
        CANCELED_ID: 6,
        EXPIRED_ID: 7
    }
}).filter('filterDate', function($filter){
	return function (date, format) {
	    if (!format) format = 'MMM dd, yyyy';
	    return $filter('date')(date, format);
	}
});
