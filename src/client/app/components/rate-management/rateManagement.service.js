'use strict';
angular.module('rateManagement').factory('RateManagementService', ['ConnectorService', function (ConnectorService) {
    return $.extend({}, ConnectorService, {
        getLatestExchangeRate: function () {
            return this.get(apiRoutes.API_EXRATE);
        }
    });
}]);

