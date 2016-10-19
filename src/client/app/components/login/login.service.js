'use strict';
angular.module('loginForm').
    factory('LoginService', ['$http', '$q', function ($http, $q) {
        return {
            authenticate: function (base64String) {
                if (!base64String || base64String.length <= 0) {
                    return $q.reject({
                        message: "Invalid Http Header."
                    });
                } else {
                    var headers = {};
                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    headers[httpHeader.AUTHORIZARION] = autheticateType.BASIC + base64String;

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_AUTHENTICATE,
                        headers: headers,
                        data: {}
                    }

                    return $http(req);
                }
            }
        }
    }]);
