'use strict';

var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.NodeJSApp;
var users = require('./data/users');
var userService = require('../server/services/user-service');
var permissionService = require('../server/services/permission-service');
var groupService = require('../server/services/group-service');

var async = require('async');
var exec = require('child_process').exec;
const appConfig = require('../server/libs/app-config');
var nodeUtil = require('util');

var persGroups = require('../server/security/permissions-groups');
var groupsWithPermissions = require('./data/permissions');

function cleanUpCache(callback) {
    let redis = appConfig.getRedis();
    let host = redis.host ? nodeUtil.format('-h %s', redis.host) : '';
    let port = redis.port ? nodeUtil.format('-p %s', redis.port) : '';
    let db = redis.db ? nodeUtil.format('-n %s', redis.db) : '';
    let pass = redis.pass ? nodeUtil.format('-a %s', redis.pass) : '';
    let prefix = redis.prefix ? nodeUtil.format('%s', redis.prefix) : '';

    let cmdSearch = nodeUtil.format('redis-cli --scan --pattern \'%s*\' %s %s %s %s', prefix, host, port, pass, db);
    let cmdDel = nodeUtil.format('xargs redis-cli %s %s %s %s DEL', host, port, pass, db);
    let cmd = cmdSearch + ' | ' + cmdDel;

    let isWin = /^win/.test(process.platform);

    if (!isWin) {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error('ERR: %s', stderr);
            } else {
                console.log('Clean Up Cache done.');
            }
            callback(error);
        });
    } else {
        callback(null);
    }
}

function setupPermissions(callback) {

    let permissions = [];

    for (let key in persGroups.Permissions) {

        console.log('[%s] : %s', key, persGroups.Permissions[key]);

        permissions.push({
            name: persGroups.Permissions[key],
            key: key
        });

    }

    permissionService.createPermissions(permissions, callback);
}

function setupGroups(callback) {
    let groups = [];

    for (let key in persGroups.Groups) {

        groups.push({
            name: persGroups.Groups[key]
        });

    }

    groupService.createGroups(groups, callback);
}

function convertObjectsToMaps(objs) {

    let map = new Map();
    objs.forEach(function (obj) {
        map.set(obj.name, obj.id);
    });

    return map;
}

function setupGroupsWithPermissions(permissions, groups, callback) {

    let permissionMaps = convertObjectsToMaps(permissions);
    let groupMaps = convertObjectsToMaps(groups);
    let grpPerPairs = [];

    groupsWithPermissions.groups.forEach(function (group) {

        let groupName = persGroups.getGroup(group.name);
        let groupId = groupMaps.get(groupName);

        if (!groupId) return;

        group.permissions.forEach(function (per) {
            let perName = persGroups.getPermission(per);
            let perId = permissionMaps.get(perName);

            if (!perId) return;

            grpPerPairs.push({
                permissionId: perId,
                groupId: groupId
            });

        });

    });

    groupService.setupGroupPermission(grpPerPairs, function (err) {
        callback(err);
    });

}

function getGroup(groupKey, groupMaps) {
    let groupName = persGroups.getGroup(groupKey);

    if (!groupName) return null;

    let groupId = groupMaps.get(groupName);

    if (!groupId) return null;

    return {
        id: groupId,
        name: groupName
    };
}

ds.automigrate(function (err) {
    if (err) {
        console.error('ERROR : %s', err.message);
        process.exit(0);
    }

    async.waterfall([
        function (next) {
            setupPermissions(function (err, permissions) {
                next(err, permissions);
            });
        },
        function (permissions, next) {
            setupGroups(function (err, groups) {
                next(err, permissions, groups);
            });
        },
        function (permissions, groups, next) {
            setupGroupsWithPermissions(permissions, groups, function (err) {
                next(err, groups);
            });
        },
        function (groups, next) {
            let groupMaps = convertObjectsToMaps(groups);


            let userObjs = [];

            for (let key in users) {

                let user = users[key];
                let groupObjs = [];

                for (let key in user.groups) {
                    let grp = getGroup(user.groups[key], groupMaps);

                    if (grp) groupObjs.push(grp);

                }

                user.groups = groupObjs;

                console.log('USER %s', JSON.stringify(user));

                userObjs.push(user);
            }

            next(null, userObjs);
        },
        function (userObjs, next) {
            userService.createUsers(userObjs, function (err, users) {
                next(err, users);
            });
        },
        function ( users, next) {
            cleanUpCache(next);
        }
    ], function (err) {

        if (err) {
            console.error('ERROR : %s', err.message);
        }

        process.exit(0);
    });

});
