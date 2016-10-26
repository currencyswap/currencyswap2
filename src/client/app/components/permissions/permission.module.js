'use-strict';

angular.module('permission', []).factory('PermissionService', ['$http', '$q', function ($http, $q) {
    return {
        getCurrentPermission: function (token) {
            var headers = {};

            headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
            headers[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_PERMISSIONS,
                headers: headers,
                data: {}
            };

            return $http(req);
        }
    }
}]);
