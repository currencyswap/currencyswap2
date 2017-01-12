/**
 * Created by dqlgnoleth on 11/01/2017.
 */

var errors = require('../libs/errors/errors');
var errorUtil = require('../libs/errors/error-util');
var userService = require('../services/user-service');
var supportService = require('../services/support-service');
var userConverter = require('../converters/user-converter');
var multer = require('multer');
var md5 = require('js-md5');
var async = require('async');
var constant = require('../libs/constants/constants');
var appRoot = require('app-root-path');
var appConfig = require('../libs/app-config');
var userValidation = require('../validation/user-validation');
var stringUtil = require('../libs/utilities/string-util');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Payment Evidence Folder : %s", appConfig.getPaymentEvidenceFolder());
        cb(null, appConfig.getPaymentEvidenceFolder());
    },
    filename: function (req, file, cb) {
        if (!req.body || !req.body.imageOwner || !req.body.orderCode) {
            cb(errorUtil.createAppError(errors.INVALID_INPUT_DATA));
        }
        var plainFileName = req.body.orderCode + "|" + req.body.imageOwner;
        var encryptedFileName = stringUtil.encryptString(plainFileName, constant.ENCRYPTION_ALGORITHM, constant.ENCRYPTION_PWD, 'utf8', 'hex');
        cb(null, encryptedFileName + ".png");
    }
});

var upload = multer({storage: storage});

module.exports = function (app) {
    var router = app.loopback.Router();

    router.post('/', upload.single('file'), function (req, res, next) {
        return res.status(200).send({});
    });

    return router;
};