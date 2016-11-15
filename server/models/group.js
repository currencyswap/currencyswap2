'use strict';

module.exports = function(Group) {
    Group.findAllGroups = function (callback) {
        Group.find(function (err, groups) {
            if (err) return callback (err);
            else return callback(null, groups)
        })
    }
};
