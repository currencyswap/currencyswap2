'use strict';

angular.module('currencySwapApp', [
  'loginForm',
  'ngRoute',
  'ngCookies',
  'appHeader'
]).run(function ($rootScope, $cookies, $location) {
  $rootScope.title = appConfig.title;

  $rootScope.loggedIn = false;

  var token = $cookies.get(global.tokenKey);

  // step1: check cookies for token key
  if (!token) {
    $rootScope.loggedIn = false;
    $location.path(routes.LOGIN);
  }
  // step2:
}).controller('CurrencySwapController', function ($rootScope, $scope) {
  if ($rootScope.loggedIn) {
    $scope.loggedIn = true;
  }
});
