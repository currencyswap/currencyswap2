'use strict';
/**
 * @author Viet Nghiem
 */
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var dbUtil = require('../libs/utilities/db-util');
var app = require('../server');

exports.getCreator = function(username) {
    var groupRelation = {
            'relation' : 'groups',
            'scope' : {
                'fields' : [ 'id', 'name' ],
            }
          };
    return dbUtil.executeModelFn(app.models.Member, 'findOne', {'where': {"username": username}, 'include': [groupRelation]});
};

exports.getGroups = function() {
    return dbUtil.executeModelFn(app.models.Group, 'find', {});
};

exports.saveMessage = function(input) {
    var dto = {
            title: input.title,
            message: input.message,
            created: new Date(),
            isGroupMessage: (input.group? true : false),
            creatorId: input.creatorId,
            receiverId: input.receiverId
    };
    return dbUtil.executeModelFn(app.models.Message, 'create', dto);
};

exports.getMessages = function() {
    var creatorRelation = {
            'relation' : 'creator',
            'scope' : {
                'fields' : [ 'id', 'username', 'email', 'fullName' ],
            }
          };
    return dbUtil.executeModelFn(app.models.Message, 'find', {'include': [creatorRelation]});
};