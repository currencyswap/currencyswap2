'use strict';
/**
 * @author Viet Nghiem
 */
angular.module('support').factory('SupportService', ['ConnectorService', function (ConnectorService) {
    return $.extend({}, ConnectorService, {
        saveSupport: function (support) {
            return this.post(apiRoutes.API_SUPPORTS, support);
        },
        getCreator: function(username) {
            return this.get(apiRoutes.API_SUPPORTS_CREATOR, {'username': username});
        }
   });
}]);

