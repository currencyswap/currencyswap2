'use strict';

angular.module('register').factory('RegisterService', ['$http', '$q', '$location', function ($http, $q, $location) {
    return {
        compressUserDataToObj: function (userData) {
            userData.username = userData.username.trim();
            var resultUser = {
                username: userData.username,
                fullName: userData.fullName,
                cellphone: userData.cellphone,
                birthday: userData.birthday,
                profession: userData.profession,
                email: userData.email,
                nationalId: userData.nationalId,
                password: userData.password,
                bankAccountName: userData.bankAccountName,
                bankAccountNumber: userData.bankAccountNumber,
                bankName: userData.bankName,
                bankCountry: userData.bankCountry,
                addresses: [
                    {
                        address: userData.address,
                        country: userData.country,
                        city : userData.city,
                        postcode: userData.postcode,
                        state: userData.state
                    }],
                group:'User',
                inviter: userData.inviter
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
        },

        sendActiveRequest: function (activeCode) {
            var headers = {};

            headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;

            var postData = {
                activeCode: activeCode
            };

            var req = {
                method: httpMethods.POST,
                url: apiRoutes.API_REGISTER,
                headers: headers,
                data: postData
            };

            return $http(req);
        },

        validateInviterAndInviteeEmail: function (inviter, inviteeEmail) {
            if (inviter.length < 4
                || inviter.length > 64
                || inviteeEmail.length < 5
                || inviteeEmail.length > 64
                || !validator.isEmail(inviteeEmail)) {
                $location.url(routes.REGISTER);
            }
        }
    }
}]);

