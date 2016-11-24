'use strict';

var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var dbUtil = require('../libs/utilities/db-util');
var app = require('../server');

exports.getCreator = function (username) {
    var groupRelation = {
            'relation' : 'groups',
            'scope' : {
                'fields' : [ 'id', 'name' ],
            }
          };
    return dbUtil.executeModelFn(app.models.Member, 'findOne', {'where': {"username": username}, 'include': [groupRelation]});
};
exports.saveMessage = function (input) {
    var dto = {
            title: input.title,
            message: input.message,
            created: new Date(),
            isGroupMessage: (input.group? true : false)
    };
    return dbUtil.executeModelFn(app.models.Member, 'findOne', {'where': {"username": input.username}}).then(function(resp){
        if (resp && resp.username) {
            dto.creatorId = resp.id;
            return dbUtil.executeModelFn(app.models.Message, 'create', dto);
        } else {
            return errorUtil.createAppError(errors.NO_USER_FOUND_IN_DB);
        }
    }, function(err) {
        if (err) console.error('ERROR [%s]: %s', err.name, err.message);
        var error = err ? errorUtil.createAppError(errors.SERVER_GET_PROBLEM) : null;
        return error;
    });
};
