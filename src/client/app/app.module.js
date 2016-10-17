'use strict';

angular.module('currencySwapApp', [

  'ngRoute', 'ngCookies', 'appHeader'
]).run(function ($rootScope, $cookies) {

  $rootScope.title = appConfig.title;

});
