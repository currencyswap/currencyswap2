'use strict';

angular.module('invite').factory('InviteService', ['$http', '$q', 'CookieService','GLOBAL_CONSTANT',function ($http, $q, CookieService, GLOBAL_CONSTANT) {
    return {
        invite: function (email) {
            if (!email) {
                return $q.reject({
                    message: GLOBAL_CONSTANT.EMPTY_EMAIL
                });
            } else {
                var token = CookieService.getToken();
                var currentUser = CookieService.getCurrentUser();
                var headers = {};

                headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

                var postData = {currentUser: currentUser.username, regEmail: email};

                var req = {
                    method: httpMethods.POST,
                    url: apiRoutes.API_INVITE,
                    headers: headers,
                    data: postData
                };

                return $http(req);
            }
        }
    }
}]);

