'use-strict';

angular.module('cookieManager', ['ngCookies'])
    .factory('CookieService', ['$cookies', function ($cookies) {
        return {
            setUpCookies: function (token) {
                var options = {
                    expires: new Date(Date.now() + parseInt(appConfig.cookieExpried))
                };

                var obj = getInfoFormToken(token);

                if ( !obj.avatarUrl ) {
                    obj.avatarUrl = global.DEF_AVATAR;
                }

                $cookies.put(global.TOKEN, token, options);
                $cookies.put(global.CURRENT_USER, JSON.stringify({
                    username: obj.username,
                    fullName: obj.fullName,
                    avatarUrl : obj.avatarUrl
                }), options);
            },
            cleanUpCookies: function () {
                $cookies.remove(global.TOKEN);
                $cookies.remove(global.CURRENT_USER);
            },
            getToken: function () {
                return $cookies.get(global.TOKEN);
            },
            getCurrentUser: function () {
                var userString = $cookies.get(global.CURRENT_USER);
                return JSON.parse(userString);
            }
        }
    }]);;
