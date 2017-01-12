'use strict';

var appConfig = require('../libs/app-config');
var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    var router = app.loopback.Router();
    var mediaRootPath = appConfig.getMediaFolder();
    
    var extSupport = 'png|jpg|tif|gif|svg|jpeg|jfif|tiff|bmp|exif|ppm|pgm|pbm|pnm'.split('|');
    var appendExt = function(filename) {
        var found = false;
        var i = filename.lastIndexOf('.');
        if (i > 0) {
            var ext = filename.substring(i+1);
            if (ext) {
                ext = ext.toLowerCase();
                if (extSupport.indexOf(ext) >= 0) {
                    found = true;
                }
            }
        }
        if (!found) {
            filename += '.png';
        }
        return filename;
    };
    var _sendAvatar = function(res, filePath) {
        console.log('_sendAvatar', filePath);
        fs.stat(filePath, function(err, stats) {
          if (err) {
              var not_found =  path.join(__dirname, '../../client/assets/images', 'default-user.png');
              res.sendFile(not_found);
          } else {
             res.sendFile(filePath);
          }
        });
    };
    router.get('/media/:filename', function (req, res) {
        var filename = req.params.filename;
        if (filename) {
            filename = appendExt(filename);
        }
        var filePath = path.join(mediaRootPath, filename);
        _sendAvatar(res, filePath) ;
    });

    return router;
};
