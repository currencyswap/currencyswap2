'use strict';
/**
 * @author Viet Nghiem
 */
var errorUtil = require('../libs/errors/error-util');
var errors = require('../libs/errors/errors');
var dbUtil = require('../libs/utilities/db-util');
var app = require('../server');

var MAX_QUICK_NUM = 5;
var creatorRelation = {
        'relation' : 'creator',
        'scope' : {
            'fields' : [ 'id', 'username', 'email', 'fullName' ]
        }
      };
var groupRelation = {
        'relation' : 'groups',
        'scope' : {
            'fields' : [ 'id', 'name' ]
        }
      };
exports.getCreator = function(username) {
    return dbUtil.executeModelFn(app.models.Member, 'findOne', {'where': {"username": username}, 'include': [groupRelation]});
};
exports.getCreatorById = function(id) {
    return dbUtil.executeModelFn(app.models.Member, 'findOne', {'where': {"id": id}, 'include': [groupRelation]});
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
            receiverId: input.receiverId,
            orderCode: input.orderCode
    };
    return dbUtil.executeModelFn(app.models.Message, 'create', dto);
};

exports.messageToGroup = function(input) {
    return exports.getGroups().then(function(groups){
        // get the group receiver
        for (var i=0; i<groups.length; i++) {
            if (input.isAdmin) {
                if (groups[i].name === 'Admin') {
                    input.receiverId = groups[i].id;
                    break;
                }
            } else if (groups[i].name){
                input.receiverId = groups[i].id;
                break;
            }
        }
        if (!input.receiverId) {
            return {'message': 'Could not save message due to system is laking of groups setting'};
        }
        return exports.saveMessage(input);
    }, function(){
        return {'message': 'Could not save message due to system issue'};
    });
};

exports.getMessages = function(userId, groups, limit, skip, isUnreadCount) {
    var readersRelation = {
            'relation' : 'reads',
            'scope' : {
                'where' : {'readerId': userId},
                'fields' : [ 'readerId', 'created' ]
            }
    };
    var condition = {'receiverId': userId};

    if (groups && groups.length > 0) {
        var orConds = [{'receiverId': userId}];
        for (var i=0; i<groups.length; i++) {
            orConds.push({and : [{'isGroupMessage': true}, {'receiverId': groups[i].id}]});
        }
        condition = { or : orConds };
    }
    var filter = {'include': [creatorRelation, readersRelation], 'order': 'id DESC', 'where': condition};
    if (limit == parseInt(limit) && limit > 0) {
        filter['limit'] = limit;
    }
    if (skip == parseInt(skip) && skip >= 0) {
        filter['skip'] = skip;
    }
    return dbUtil.executeModelFn(app.models.Message, 'find', filter);
};

exports.markReadMessage = function(messageId, readerId) {
    var dto = {
            messageId: messageId,
            readerId: readerId,
            created: new Date()
    };
    var condition = { 'where': {
            and : [{'readerId': readerId}, {'messageId': messageId}]
        }
    };
    return dbUtil.executeModelFn(app.models.MessageRead, 'findOrCreate', condition, dto);
};