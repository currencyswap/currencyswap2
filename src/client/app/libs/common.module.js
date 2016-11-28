/**
 *
 * @version 1.0
 * @author Viet Nghiem
 */
'use strict';
angular.module('common', ['ngRoute', 'cookieManager', 'permission', 'navigation', 'ui.bootstrap']).run(function($rootScope, $q, CookieService, SupportService){
    $rootScope.getCreator = function() {
        var def = $q.defer();
        var user = CookieService.getCurrentUser();
        if (user.username) {
            SupportService.getCreator(user.username).then(function(userInst){
                if (userInst.username) {
                    $rootScope.user = userInst;
                    $rootScope.startSocket(userInst);
                    def.resolve(userInst);
                } else {
                    def.reject('Error: Current User Info', userInst);
                }
            }, function(err){
                def.reject('Error: Current User Info', err);
            });
        } else {
            def.reject('No user session exists');
        }
        return def.promise;
    };
    $rootScope.startSocket = function(initData) {
        console.log('Starting Socket IO');
        var skParams = {
                host: ('ws://'+(location.host || location.hostname)),
                skOptions : {
                  'transports':[ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]
                  , 'force new connection': true
                },
                cmdOptions : {
                  '/server/init': {'message': initData}
                }
              };
            $.WebSocketHandler(skParams);
            // below statement is for testing purpose only, this will be remove if on production
            $rootScope.testSocket();
    };
    $rootScope.stopSocket = function() {
        $.forceToDisconnectSK();
    };
    $rootScope.testSocket = function() {
        $.subscribe('/receive/pong', function(data) {
            console.log('/receive/pong', JSON.stringify(data));
          });
//          setInterval(function(){
//            $.publish('/send/ping', [{'message': 'Hello new time: ' + Math.round(Math.random()*1000)}]);
//          }, 2000);
    };
    var _retreiveUser = function() {
        if (!$rootScope.user) {
            $rootScope.getCreator().then(function(resp){
                //console.log('Success: Current User Info', resp);
            }, function(e){
                console.log(e);
                //setTimeout(_retreiveUser, 2000);
            });
        };
    };
    _retreiveUser();
});

angular.module('common').factory('ConnectorService', ['$http', '$q', 'CookieService', function ($http, $q, CookieService) {
    var debug = true;
    var timeout = 60000;//1 min for each request
    var token = null;

      var _getErrorMsg = function(resp) {
        var e = resp.responseJSON;
        var msg = 'Unknown Error';
        if (e && (e.message || (e.error && e.error.message))) {
          msg = e.message||e.error.message;
        }
        return msg;
      };

      var _ajax = function(method, url, data, headers) {
          // update token header
          token = CookieService.getToken();

          return $.ajax({
            url : url,
            type : method,
            dataType : 'json',
            timeout: timeout,
            headers: headers,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", autheticateType.BEARER + token);
            },
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

