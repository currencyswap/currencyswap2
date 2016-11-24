'use strict';
/**
 * @author Viet Nghiem
 */
angular.module('notification').factory('NotiService', ['ConnectorService', function (ConnectorService) {
    return $.extend({}, ConnectorService, {
        getMessages: function() {
            return this.get(apiRoutes.API_SUPPORTS);
        }
   });
}]);

