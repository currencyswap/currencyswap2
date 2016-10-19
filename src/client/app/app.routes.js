'use strict';

angular.
  module('currencySwapApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      $routeProvider.
        when( routes.LOGIN, {
          template: '<login-form></login-form>'
        }).
        otherwise('');
    }
  ]);
