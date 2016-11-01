'use strict';

angular.module('register')
    .component('register', {
        templateUrl: 'app/components/register/register.template.html',
        controller: ['$scope',
            '$rootScope',
            '$location',
            '$http',
            function registerController($scope, $rootScope, $location, $http) {
                $scope.user = {};

                $scope.onSubmit = function () {
                    var newUser = {
                        username: $scope.user.username,
                        fullName: $scope.user.fullname,
                        birthday: $scope.user.dobYear + '-' + $scope.user.dobMonth + '-' + $scope.user.dobDay,
                        expiredDate: "2017-06-30",
                        email: $scope.user.email,
                        password: $scope.user.password,
                        isActivated: true,
                        addresses: [
                            {
                                address: $scope.user.address,
                                country: $scope.user.country,
                                city : 'Hanoi',
                                postcode: 29111990
                            }],
                        groups: [{ id: 2, name: 'User' }]
                    };

                    var headers = {};

                    headers[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
                    var postData = {
                        newUser: newUser
                    };

                    var req = {
                        method: httpMethods.POST,
                        url: apiRoutes.API_REGISTER,
                        headers: headers,
                        data: postData
                    };

                    return $http(req)
                        .then(function (response) {
                            console.log(response);
                        }, function (error) {
                            console.log(error);
                        });
                }
            }]
    });
