
'use strict';

angular.module('userDetails').factory('UserDetailsServive', ['$http', function ($http, PermissionService) {
    return {
        getUser: function (userId, headers) {
            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_USERS + '/' + userId,
                headers: headers
            };
            return $http(req);
        }
    }
}]);
