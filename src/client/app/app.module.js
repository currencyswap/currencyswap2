'use strict';

angular.module('currencySwapApp', [
  'loginForm',
  'ngRoute',
  'ngCookies',
  'appHeader'
]).run(function ($rootScope, $cookies, $http) {
  $rootScope.title = appConfig.title;
  // step1: check cookies for token key
  if (!$cookies.tokenKey) {
    $rootScope.loggedIn = true;
  }
  // step2: B
}).controller('CurrencySwapController', function ($rootScope, $scope) {
  if ($rootScope.loggedIn) {
    $scope.loggedIn = true;
  }
});
