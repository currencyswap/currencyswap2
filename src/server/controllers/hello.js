'use strict';

module.exports = function (app) {
    var router = app.loopback.Router();
    
    router.get('/', function (req, res) {
        res.status(200).send({ message : 'pong' });
    });

    return router;
};
