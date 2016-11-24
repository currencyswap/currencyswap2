'use strict';
/**
 * @author Viet Nghiem
 */
var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var service = require('../services/support-service');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/creator', function (req, res, next) {
        var username = req.query.username;
        if (!username) {
            return res.status(404).send(errorUtil.createAppError(errors.INVALID_PARAMETER_INPUT));
        }
        var user = req.currentUser;
        service.getCreator(username).then(function(resp){
            return res.send(resp);
        }, function(err){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.get('/', function (req, res, next) {
        service.getMessages().then(function(resp){
            res.send({'isSuccessful': true, 'messages': resp});
        }, function(e){
            return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
        });
    });
    router.post('/', function (req, res, next) {
        var input = req.body;
        if (req.currentUser && req.currentUser.id != input.creatorId) {
            return res.status(404).send(errorUtil.createAppError(errors.INVALID_PARAMETER_INPUT));
        }

        var _save = function() {
            if (!input.receiverId) {
                return res.status(404).send(errorUtil.createAppError(errors.INVALID_PARAMETER_INPUT));
            }
            service.saveMessage(input).then(function(resp){
                res.send({'isSuccessful': true});
            }, function(e){
                return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            });
        };

        if (input.group) {
            service.getGroups().then(function(groups){
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
                _save();
            }, function(){
                return res.status(500).send(errorUtil.createAppError(errors.SERVER_GET_PROBLEM));
            });
        } else {
            _save();
        }
    });

    return router;
};
