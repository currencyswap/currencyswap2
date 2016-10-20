'use strict';
var mailSender = require('../libs/mail-sender');

module.exports = function (app) {
    var router = app.loopback.Router();

    router.get('/', function (req, res) {

        var mailOptions = {
            from: 'vietvu@vsii.com', 
            to: 'vu.hoang.viet@vsi-international.com', 
            subject: 'Hello', 
            text: 'Hello world', 
            html: '<b>Hello world</b>' 
        };

        mailSender.sendMail( mailOptions, function ( err, info ) {
            console.log('AAAAAAAAAAAa');            
        });

        res.status(200).send({ message: 'pong' });
    });

    return router;
};
