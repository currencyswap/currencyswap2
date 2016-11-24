/**
 *
 * @version 1.0
 * @author Viet Nghiem
 */
'use strict';
angular.module('common', ['ngRoute', 'cookieManager', 'permission', 'navigation', 'ui.bootstrap']).run(function($rootScope, CookieService, SupportService){
    $rootScope.getCreator = function() {
        var user = CookieService.getCurrentUser();
        if (!user.username) {
            console.log('No user session exists');
            return;
        }
        SupportService.getCreator(user.username).then(function(resp){
            console.log('Success: Current User Info', resp);
            $rootScope.user = resp;
        }, function(err){
            console.log('Error: Current User Info', err);
        });
    }
    if (!$rootScope.user) {
        $rootScope.getCreator();
    }
});

angular.module('common').factory('ConnectorService', ['$http', '$q', 'CookieService', function ($http, $q, CookieService) {
    var debug = true;
    var timeout = 60000;//1 min for each request
    var token = CookieService.getToken();
    
    var defaultHeaders = {};
    defaultHeaders[httpHeader.CONTENT_TYPE] = contentTypes.JSON;
    defaultHeaders[httpHeader.AUTHORIZARION] = autheticateType.BEARER + token;

      var _getErrorMsg = function(resp) {
        var e = resp.responseJSON;
        var msg = 'Unknown Error';
        if (e && (e.message || (e.error && e.error.message))) {
          msg = e.message||e.error.message;
        }
        return msg;
      };

      var _ajax = function(method, url, data, headers) {
          return $.ajax({
            url : url,
            type : method,
            dataType : 'json',
            timeout: timeout,
            headers: $.extend({}, defaultHeaders, headers),
            data: data
          }).fail(function(resp){
            alert(_getErrorMsg(resp));
          }).always(function(){
              if (debug) {
                  console.log('Request GET done');
              }
          }).done(function(data){
              if (debug) {
                  console.log('Response', JSON.stringify(data));
              }
          });
       };
        return {
          getErrorMsg: _getErrorMsg,
          get: function(url, data, headers) {
            return _ajax('GET', url, data, headers);
          },
          post: function(url, data, headers) {
            return _ajax('POST', url, data, headers);
          },
          put: function(url, data, headers) {
            return _ajax('PUT', url, data, headers);
          },
          del: function(url, headers) {
            return _ajax('DELETE', url, null, headers);
          }
        };
}]);

