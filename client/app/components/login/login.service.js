'use strict';

angular.module('loginForm').factory('LoginService', ['$http', '$q', 'GLOBAL_CONSTANT',function ($http, $q) {
    return {
        authenticate: function (user) {
            if (!user || !user.username || !user.password) {
                return $q.reject({
                    message: 'Empty username or password !'
                });
            } else {
                var headers = {};
                var base64Content = encodeUserNameAndPasswordBase64(user.username, user.password);

                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                headers[httpHeader.AUTHORIZARION] = autheticateType.BASIC + base64Content;

                var req = {
                    method: httpMethods.POST,
                    url: apiRoutes.API_AUTHENTICATE,
                    headers: headers,
                    data: {}
                };

                return $http(req);
            }
        }
    }
}]);
