'use strict';

angular.module('register').factory('RegisterService', ['$http', '$q', function ($http, $q) {
    return {
        compressUserDataToObj: function (userData) {
            if (userData.dobYear && userData.dobMonth && userData.dobDay) {
                var birthday = userData.dobYear + '-' + userData.dobMonth + '-' + userData.dobDay;
            } else {
                birthday = null;
            }

            userData.username = userData.username.trim();

            var resultUser = {
                username: userData.username,
                fullName: userData.fullname,
                cellphone: userData.cellphone,
                birthday: birthday,
                profession: userData.profession,
                email: userData.email,
                password: userData.password,
                addresses: [
                    {
                        address: userData.address,
                        country: userData.country,
                        city : userData.city,
                        postcode: userData.postcode
                    }],
            };
            return resultUser;
        },

        submitRequest: function (userObj) {
            var headers = {};

            headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
            var postData = {
                newUser: userObj
            };

            var req = {
                method: httpMethods.POST,
                url: apiRoutes.API_REGISTER,
                headers: headers,
                data: postData
            };

            return $http(req);
        }
    }
}]);

