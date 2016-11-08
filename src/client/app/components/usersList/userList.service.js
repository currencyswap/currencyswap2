
'use strict';

angular.module('userList').factory('UserListService', ['$http', function ($http, PermissionService) {
    return {
        fetchAllUser: function (headers) {
            var req = {
                method: httpMethods.GET,
                url: apiRoutes.API_USERS,
                headers: headers,
                data: {}
            };

            return $http(req);
        }
    }
}]);
