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
    INVALID_USR_OR_PWD_MSG: {
        message: 'Invalid username or password !',
    },
    EMPTY_USR_OR_PWD_MSG: {
        message: 'Empty username or password !'
    },
    ERR_SERVER_GETS_PROBLEM: {
        code: 1,
        message: "Server gets problem !!!"
    },
    ERR_REDIS_PARAMS_IS_REQUIRED : {
        code: 2,
        message: "Redis parameter is required !!!"
    },
    ERR_NO_USERNAME : {
        code: 20,
        message: "Username is required !!!"
    },
    ERR_NO_PASSWORD : {
        code: 21,
        message: "Password is required !!!"
    },
    ERR_NO_EMAIL : {
        code: 22,
        message: "Email is required !!!"
    },
    ERR_MISSING_REDIS_KEY : {
        code: 3,
        message: "Redis key '%s' is not set."
    },
    ERR_INVALID_USERNAME : {
        code: 23,
        message: "Invalid username '%s' !!!"
    },
    ERR_INVALID_PASSWORD : {
        code: 24,
        message: "Invalid password  !!!"
    },
    ERR_REDIS_GETS_PROBLEM : {
        code: 4,
        message: "Redis server gets problems !!!"
    },
    ERR_INVALID_HTTP_HEADER : {
        message: "Invalid HTTP Headers  !!!"
    },
    ERR_INVALID_AUTHORIZATION_HEADER : {
        code: 5,
        message: "Invalid Autorization Header !!!"
    },
    ERR_INVALID_TOKEN_API_KEY : {
        code: 40,
        message: "Invalid token key !!!"
    },
    ERR_INVALID_TOKEN_API_KEY_FOR_USER : {
        code: 60,
        message: "Invalid token key for %s !!!"
    },
    ERR_LOGS_PARAMS_IS_REQUIRED : {
        code: 7,
        message: "Logs parameter is required !!!"
    },
    ERR_PERMISSION_DENIED : {
        code: 61,
        message: "Permission denied !!!"
    },
    ERR_NO_USERID : {
        code: 26,
        message: "Invalid user Id !!!"
    },
    ERR_EMAIL_NOT_FOUND : {
        code: 27,
        message: "Email not found !!!"
    },
    ERR_INVALID_USERID : {
        code: 25,
        message: "Invalid user Id '%s' !!!"
    },
    ERR_INVALID_REQUEST_PATH : {
        code: 8,
        message: "Invalid path '%s' !!!"
    },
    ERR_INVALID_PERMISSION :  {
        code: 60,
        message: "Invalid permission '%s' !!!"
    },
    ERR_USER_IS_NOT_AVAILABLE : {
        code: 62,
        message: "User '%s' is not available. Please contact with Admin."
    },
    ERR_INVALID_SMTP_OPTIONS : {
        code: 9,
        message: "Invalid SMTP Options"
    },
    ERR_MAIL_SENDER_NOT_AVAILABLE : {
        code: 10,
        message: "Mail Sender is not available."
    },
    ERR_COULD_NOT_SEND_MAIL: {
        code: 11,
        message: "Could not send mail."
    },
    RESET_PWD_CODE_NOT_FOUND: {
        code: 28,
        message: "Reset password code is not found in redis."
    },
    RESET_PWD_CODE_DOES_NOT_MATCH: {
        code: 29,
        message: "Reset password code does not match in redis"
    },
    USER_NAME_EXISTED : {
        code: 30,
        message: "User name is existed"
    },
    EMAIL_EXISTED : {
        code: 31,
        message: "Email is existed"
    },
    ERR_TX_INIT_FAILED : {
        code: 80,
        message: "Transaction initialization is failed"
    },
    COULD_NOT_SAVE_USER_TO_DB: {
        code: 32,
        message: "Could not save user to DB"
    },
    COULD_NOT_SAVE_USER_GR_TO_DB: {
        code: 33,
        message: "Could not save user group to DB"
    },
    COULD_NOT_SAVE_USER_ADDR_TO_DB: {
        code: 34,
        message: "Could not save user addresses to DB"
    }
}).controller('ngViewCtrl',['$scope', '$rootScope',  function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function (event) {
        console.log('123456');
        $rootScope.isLoading = false;
    });
}]);